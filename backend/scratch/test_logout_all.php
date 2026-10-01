<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/JwtHelper.php";

$db = new Database();
$pdo = $db->getConnection();

echo "=== Testing Multi-Device Revocation (Logout All Devices) ===\n";

// 1. Ensure test user exists
$testEmail = "test_device_revocation@underpure.com";
$testPass = "Pass12345!";

$pdo->prepare("DELETE FROM users WHERE email = ?")->execute([$testEmail]);
$passHash = password_hash($testPass, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, is_admin, token_version) VALUES (?, ?, ?, 0, 1)");
$stmt->execute(["Test Device User", $testEmail, $passHash]);
$userId = $pdo->lastInsertId();

echo "[1] Created test user id=$userId with initial token_version=1\n";

// 2. Simulate Login (Issue Token A for Device 1)
$tvStmt = $pdo->prepare("SELECT token_version FROM users WHERE id = ?");
$tvStmt->execute([$userId]);
$currentTv = (int)$tvStmt->fetchColumn();

$tokenA = JwtHelper::encode([
    "id" => $userId,
    "email" => $testEmail,
    "role" => "customer",
    "tv" => $currentTv,
    "exp" => time() + 3600
]);

// Simulate Token B (Device 2)
$tokenB = JwtHelper::encode([
    "id" => $userId,
    "email" => $testEmail,
    "role" => "customer",
    "tv" => $currentTv,
    "exp" => time() + 3600
]);

echo "[2] Issued Token A (Device 1) and Token B (Device 2) with tv=$currentTv\n";

// Function to simulate authMiddleware verification
function verifyTokenWithMiddleware($token, $pdo) {
    $decoded = JwtHelper::decode($token);
    if (!$decoded) {
        return ["status" => 401, "reason" => "Invalid JWT"];
    }
    
    $stmt = $pdo->prepare("SELECT is_admin, token_version FROM users WHERE id = ?");
    $stmt->execute([$decoded['id']]);
    $dbUser = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$dbUser) {
        return ["status" => 401, "reason" => "User not found"];
    }

    $userTv = (int)($dbUser['token_version'] ?? 1);
    $tokenTv = isset($decoded['tv']) ? (int)$decoded['tv'] : 0;
    if ($tokenTv < $userTv) {
        return ["status" => 401, "reason" => "SESSION_REVOKED (tokenTv=$tokenTv < userTv=$userTv)"];
    }

    return ["status" => 200, "user" => $decoded];
}

// 3. Verify both tokens succeed before logout-all
$resA1 = verifyTokenWithMiddleware($tokenA, $pdo);
$resB1 = verifyTokenWithMiddleware($tokenB, $pdo);

if ($resA1['status'] === 200 && $resB1['status'] === 200) {
    echo "  [PASS] Device 1 and Device 2 successfully authenticated with active session\n";
} else {
    echo "  [FAIL] Initial authentication failed!\n";
    exit(1);
}

// 4. Trigger logoutAll (Simulate Device 1 clicking 'Sign out of all devices')
$_REQUEST['user'] = ["id" => $userId];
$upd = $pdo->prepare("UPDATE users SET token_version = token_version + 1 WHERE id = ?");
$upd->execute([$userId]);

$tvStmt->execute([$userId]);
$newTv = (int)$tvStmt->fetchColumn();
echo "[3] 'Sign out of all devices' executed. New DB token_version=$newTv\n";

// 5. Verify Token A and Token B are now REVOKED
$resA2 = verifyTokenWithMiddleware($tokenA, $pdo);
$resB2 = verifyTokenWithMiddleware($tokenB, $pdo);

if ($resA2['status'] === 401 && strpos($resA2['reason'], 'SESSION_REVOKED') !== false) {
    echo "  [PASS] Device 1 Token A is now REVOKED (401 SESSION_REVOKED)\n";
} else {
    echo "  [FAIL] Token A was NOT revoked! Reason: " . json_encode($resA2) . "\n";
    exit(1);
}

if ($resB2['status'] === 401 && strpos($resB2['reason'], 'SESSION_REVOKED') !== false) {
    echo "  [PASS] Device 2 Token B is now REVOKED (401 SESSION_REVOKED)\n";
} else {
    echo "  [FAIL] Token B was NOT revoked! Reason: " . json_encode($resB2) . "\n";
    exit(1);
}

// 6. User logs back in (e.g. on Device 1)
$tokenC = JwtHelper::encode([
    "id" => $userId,
    "email" => $testEmail,
    "role" => "customer",
    "tv" => $newTv,
    "exp" => time() + 3600
]);

$resC = verifyTokenWithMiddleware($tokenC, $pdo);
if ($resC['status'] === 200) {
    echo "  [PASS] New login Token C with updated tv=$newTv is VALID\n";
} else {
    echo "  [FAIL] New login failed! Reason: " . json_encode($resC) . "\n";
    exit(1);
}

// Ensure old tokens still remain invalid
$resA3 = verifyTokenWithMiddleware($tokenA, $pdo);
if ($resA3['status'] === 401) {
    echo "  [PASS] Old Token A remains permanently invalid\n";
} else {
    echo "  [FAIL] Old Token A became valid again!\n";
    exit(1);
}

// Clean up test user
$pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);
echo "=== ALL MULTI-DEVICE REVOCATION TESTS PASSED! ===\n";
