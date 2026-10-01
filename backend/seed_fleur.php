<?php
// seed_fleur.php
require 'config/db.php';

$db = new Database();
$pdo = $db->getConnection();

$products = [
  [
    "name" => "Rib & Crochet Bodysuit",
    "price" => 298 * 280,
    "image" => "https://fleurdumal.com/cdn/shop/files/FDM_050125_68294full.jpg?v=1780686576&width=800"
  ],
  [
    "name" => "Rib & Crochet Knit Skirt",
    "price" => 298 * 280,
    "image" => "https://fleurdumal.com/cdn/shop/files/open_crochet_skirt_blue.jpg?v=1780954523&width=800"
  ],
  [
    "name" => "Silk V Slip Dress",
    "price" => 378 * 280,
    "image" => "https://fleurdumal.com/cdn/shop/files/FDM_112125_36721_full_5c1b4818-7279-485e-913a-f2a26e07db59.jpg?v=1778016712&width=800"
  ],
  [
    "name" => "Juliet Lace Demi Bra",
    "price" => 148 * 280,
    "image" => "https://fleurdumal.com/cdn/shop/files/julietdemibrapastellimeflat.jpg?v=1781200387&width=800"
  ],
  [
    "name" => "Juliet Lace Thong",
    "price" => 78 * 280,
    "image" => "https://fleurdumal.com/cdn/shop/files/julietthongpastellimeflat.jpg?v=1781200342&width=800"
  ],
  [
    "name" => "Juliet Lace Garter Belt",
    "price" => 108 * 280,
    "image" => "https://fleurdumal.com/cdn/shop/files/julietgarterpastellimeflat.jpg?v=1781200440&width=800"
  ],
  [
    "name" => "Taste Le Rainbow Balconette Bra",
    "price" => 148 * 280,
    "image" => "https://fleurdumal.com/cdn/shop/files/FDM_051926_77402full_f8d8c9ff-9ef0-4c80-ae45-881e67f9fefa.jpg?v=1781023893&width=800"
  ],
  [
    "name" => "Taste Le Rainbow V-String",
    "price" => 78 * 280,
    "image" => "https://fleurdumal.com/cdn/shop/files/FDM_051926_77485full.jpg?v=1781023840&width=800"
  ]
];

$pdo->beginTransaction();

try {
    foreach ($products as $i => $p) {
        $slug = strtolower(str_replace([' ', '&'], ['-', 'and'], $p['name'])) . '-' . rand(1000, 9999);
        $sizes = json_encode(['XS', 'S', 'M', 'L']);
        $colors = json_encode([['name' => 'Default', 'hex' => '#000000']]);
        $inventory = json_encode([
            ['color' => 'Default', 'sizes' => [
                ['size' => 'XS', 'stock' => 10],
                ['size' => 'S', 'stock' => 10],
                ['size' => 'M', 'stock' => 10],
                ['size' => 'L', 'stock' => 10],
            ]]
        ]);
        
        $stmt = $pdo->prepare("INSERT INTO products (slug, name, price, stock_count, sizes, colors, inventory, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $slug,
            $p['name'],
            $p['price'],
            40,
            $sizes,
            $colors,
            $inventory,
            1
        ]);
        
        $productId = $pdo->lastInsertId();
        
        $stmtImg = $pdo->prepare("INSERT INTO product_images (product_id, image_url, color, is_primary) VALUES (?, ?, ?, ?)");
        $stmtImg->execute([
            $productId,
            $p['image'],
            'Default',
            1
        ]);
    }
    
    $pdo->commit();
    echo "Fleur du Mal products seeded successfully!\n";
} catch (Exception $e) {
    $pdo->rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
