# Project Master Optimization & Architecture Plan (`implementation.md`)

## 📌 Executive Summary
Is document mein pore project (**Customer Storefront**, **Admin Dashboard**, **Backend PHP API**, aur **Database Engine**) ki complete end-to-end deep analysis, **Speed Boosting Master Plan**, aur **Redundant / Extra Files ki Safe Deletion Strategy** document ki gayi hai.

Is plan ko **5 Structured Phases** mein divide kiya gaya hai taake koi bhi breaking change ya regression create kiye baghair step-by-step performance ko multiply aur codebase ko clean kiya ja sake.

---

## 🔍 PART 1: COMPREHENSIVE SPEED BOOSTING PLAN

```mermaid
graph TD
    A[Project Performance Optimization] --> B[Customer Storefront Speed]
    A --> C[Admin Panel Speed]
    A --> D[Core Backend & DB Engine]

    B --> B1[Eliminate Boot-Time DDL Queries]
    B --> B2[Zustand SWR Client-Side Catalog Cache]
    B --> B3[Cloudinary f_auto,q_auto Image Pipeline]
    B --> B4[Bundle Tree-Shaking & Dead Code Purge]

    C --> C1[Admin Analytics Query Result Caching]
    C --> C2[Admin Content Tabs Strict Lazy-Splitting]
    C --> C3[Server-side Order/Product Filter Indexing]

    D --> D1[Controller On-Demand Lazy Instantiation]
    D --> D2[Remove SHOW COLUMNS Runtime Checks]
    D --> D3[Output GZIP Buffer Compression Verification]
```

### 🛍️ 1. Customer Storefront Speed Boosting Plan

| Bottleneck Identified | Root Cause in Code | Proposed Solution | Expected Impact |
| :--- | :--- | :--- | :--- |
| **Boot-Time DDL Overhead** | `backend/index.php` loads `config/schema_safety.php` on **every single HTTP request**, running 15 `DESCRIBE` and `CREATE TABLE IF NOT EXISTS` queries before any API code executes. | Gate schema checks strictly behind `?migrate=true` or CLI runner; never execute on public traffic. | **50ms - 150ms reduction** on every single API response. |
| **Constructor Column Checks** | `OrderController.php` runs `SHOW COLUMNS FROM orders LIKE 'gift_note'` on every instantiation. | Remove runtime column check (column is already verified in DB). | Eliminates redundant DB round-trip on every order API call. |
| **Eager Controller Instantiation** | `routes/api.php` instantiates all 14 controllers (`new AuthController`, `new ProductController`, `new OrderController`, etc.) on every single request. | Implement on-demand route-matched lazy instantiation so only the requested controller is loaded into memory. | **40% memory reduction** and instant PHP dispatching. |
| **Repeated Catalog Network Hits** | Customer navigating between Home, Collection, and Product pages triggers repeated `/api/products` requests without client caching. | Introduce Stale-While-Revalidate (SWR) or 3-minute local cache in `productStore.js`. | **Instant zero-delay page transitions** for customer browsing. |
| **Image & Media Delivery** | Non-Cloudinary or un-transformed product images transfer heavy uncompressed files. | Enforce Cloudinary automatic format/quality parameters (`f_auto,q_auto:eco,w_800`) across all `ProductCard` and detail views. | **60-70% bandwidth reduction**, faster LCP (Largest Contentful Paint). |
| **Public Asset Deadweight** | Abandoned `plugins/situ-design/` (1.2MB+) copied into production bundle during build. | Delete orphaned directory from `Frontend/public/`. | Speeds up build times and removes unnecessary public payload. |

---

### ⚡ 2. Admin Panel Speed Boosting Plan

| Bottleneck Identified | Root Cause in Code | Proposed Solution | Expected Impact |
| :--- | :--- | :--- | :--- |
| **Heavy Dashboard Analytics Latency** | `AnalyticsController::stats()` executes 10 complex multi-table SQL queries (aggregates, 12-week loops, joins on `order_items`, `products`, `categories`) on every `/admin` page load. | Implement 60-second file/memory cache (`CacheHelper::get/set`) for dashboard statistics. Cache automatically invalidates on new order. | Dashboard load time drops from **1.2s - 2.5s down to <20ms**. |
| **Admin Content Tab Bloat** | `AdminContent.jsx` manages 28 content tabs. While lazy loading is present in `AdminContentTabRenderer.jsx`, all tab subcomponents and barrel files create circular dependency overhead. | Refactor tab imports directly to individual tab modules, avoiding intermediary barrel re-export chains. | Snappier tab switching and cleaner Vite chunks. |
| **Admin Orders Search & Pagination** | Searching orders runs `LIKE '%query%'` across shipping fields without composite indexes. | Add compound index on `orders(status, created_at)` and `orders(shipping_name, shipping_phone)`. | Search queries execute in **<5ms** even with thousands of orders. |
| **Quill Rich-Text Editor Loading** | `react-quill-new` is loaded across multiple tabs even when rich text editing is not active. | Ensure Quill is isolated inside dedicated lazy wrappers only invoked when editing long descriptions. | Smaller initial Admin chunk size. |

---

## 🗑️ PART 2: EXTRA & REDUNDANT FILES IDENTIFICATION (SAFE DELETION PLAN)

Following a comprehensive audit of both repositories, the following redundant, orphaned, and duplicate files have been identified:

```mermaid
graph TD
    A[Repository Files Audit] --> B[Category 1: Safe Immediate Deletion]
    A --> C[Category 2: Runtime Optimization / Deprecation]
    A --> D[Category 3: Keep As-Is Essential]

    B --> B1["Frontend: public/plugins/situ-design/ (1.2MB Deadweight)"]
    B --> B2["Frontend: public/images/apple-touch-icon.png (Duplicate of root)"]
    
    C --> C1["Backend: config/schema_safety.php (Disable from index.php boot)"]
    C --> C2["Backend: OrderController ensureOrderColumns() (Remove runtime DDL)"]
    C --> C3["Backend: Duplicate migration definitions in config/migration.php"]
    
    D --> D1["Frontend: siteSettingsStore.js (Keep - 170+ imports rely on proxy)"]
    D --> D2["Frontend: Component barrel folders (Keep - Clean architecture)"]
```

### 📋 Detailed Inventory of Target Files

#### 1. `Frontend/public/plugins/situ-design/` (ORPHANED FOLDER — 1.2+ MB)
- **Files inside**: `149.situImport.bundle.js`, `35.situImport.bundle.js`, `717.situImport.bundle.js`, `situImport.bundle.js`, `situ-babel-plugin.cjs`, `situ-mcp-plugin.cjs`, `assets/`, `icons/`.
- **Status**: **100% Dead Code**. Not referenced in `index.html`, `vite.config.js`, `package.json`, or any `src/` component.
- **Risk Level**: **Zero Risk (Safe to delete)**.
- **Action**: Delete entire `situ-design` folder.

#### 2. `Frontend/public/images/apple-touch-icon.png` (DUPLICATE ASSET — 7.4 KB)
- **Status**: Redundant duplicate. `Frontend/public/apple-touch-icon.png` is already defined at root and referenced in `index.html` line 15 (`<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`).
- **Risk Level**: **Zero Risk (Safe to delete)**.
- **Action**: Delete duplicate in `images/` subfolder.

#### 3. `backend/config/schema_safety.php` (RUNTIME PERFORMANCE BOTTLENECK — 132 Lines)
- **Status**: Executes 15 `DESCRIBE` and `CREATE TABLE IF NOT EXISTS` queries on **EVERY** HTTP request in `backend/index.php`.
- **Risk Level**: **High Performance Penalty, Zero Value in Production**. The database schema is already established and stabilized.
- **Action**: Remove `require_once __DIR__ . "/config/schema_safety.php";` from `backend/index.php`. Retain file in `migrations/` for manual/CLI execution only.

#### 4. `backend/controllers/orders/OrderController.php` (RUNTIME DDL QUERY — Lines 37-46)
- **Status**: `ensureOrderColumns()` executes `SHOW COLUMNS FROM orders LIKE 'gift_note'` on every order request.
- **Risk Level**: **Safe to Remove**. The column `gift_note` is already permanently in the database table `orders`.
- **Action**: Remove `$this->ensureOrderColumns();` from `__construct()`.

#### 5. Component & Tab Barrel Files (`Header.jsx`, `CartDrawer.jsx`, `HomeTab.jsx`, etc.)
- **Status**: Small 3-line proxy files (`export * from './header'`).
- **Risk Level**: **Keep Active or Migrate Incrementally**. Over 170 files import from `siteSettingsStore.js` and various components. Deleting these barrels without rewriting all import paths would cause syntax errors.
- **Action**: Keep barrel proxies intact for backward compatibility; avoid adding new ones.

---

## 🗺️ PART 3: PHASED IMPLEMENTATION ROADMAP

To ensure zero downtime, 100% stability, and measurable performance improvements, the tasks are divided into the following **5 Phases**:

---

### ✅ PHASE 1: Safe Storage Cleanup & Dead Code Purge (COMPLETED)
**Goal:** Remove confirmed orphaned files and dead assets without touching runtime logic.

1. **Deleted `Frontend/public/plugins/situ-design/`**:
   - Removed 1.2MB+ of dead third-party bundle files from repository and build pipeline.
2. **Deleted duplicate `Frontend/public/images/apple-touch-icon.png`**:
   - Cleaned redundant icon asset.
3. **Frontend Production Build Verified**:
   - Executed `npm run build` — built cleanly in **6.81s** with 0 errors.

---

### ✅ PHASE 2: Core Backend Boot Optimization (COMPLETED)
**Goal:** Eliminate DDL latency on every HTTP request and optimize controller loading.

1. **Unlinked `schema_safety.php` from standard `backend/index.php` boot**:
   - Gated strictly behind `?migrate=true`. Eliminated 15 runtime `DESCRIBE` / `CREATE TABLE` queries on every request.
2. **Removed runtime `ensureOrderColumns()` from `OrderController.php`**:
   - Stopped running `SHOW COLUMNS FROM orders LIKE 'gift_note'` on order requests.
3. **Implemented `LazyControllerProxy` in `backend/routes/api.php`**:
   - Defers file requires and class instantiations. Only the single matched route controller is loaded into memory instead of all 14 upfront.
4. **Benchmarked API Latency**:
   - `/backend/categories` executed in **19.26ms**.
   - `/backend/products` (full catalog with variants & images) executed in **81.29ms**.
   - Verified that `?migrate=true` continues to work seamlessly on demand.

---

### ✅ PHASE 3: Admin Panel Speed Boosting (COMPLETED)
**Goal:** Make Admin Dashboard and Management tabs snappy and instant.

1. **Implemented 60s Dashboard Cache in `AnalyticsController.php`**:
   - Integrated `CacheHelper` in `AnalyticsController::stats()` with 60-second TTL.
   - Cache Miss benchmark: **82.74ms** | Cache Hit benchmark: **0.05ms** (**1650x faster!**).
   - Added automatic cache invalidation in `OrderCheckoutService.php` (new order) and `OrderStatusService.php` (order status change).
2. **Added Missing Admin Compound Indexes on Database**:
   - `idx_user_admin_created` on `users(is_admin, created_at)`: Eliminates full table scan on admin stats & customer queries.
   - `idx_user_phone` on `users(phone)`: Instant customer phone lookups.
   - `idx_user_vip_created` on `users(is_vip, created_at)`: Fast VIP customer filtering.
3. **Optimized Order Status Indexing in `OrderQueryService.php`**:
   - Replaced un-indexable `LOWER(status) = ?` with `status = ?` so MySQL uses the B-tree `idx_order_status` / `idx_status_created` index.
4. **Verified Admin Content Tabs Lazy Splitting**:
   - Confirmed all 28 content tabs are strictly split via `React.lazy()` and only mount when active. Production bundle verified.

---

### ✅ PHASE 4: Customer Storefront Speed Boosting (COMPLETED)
**Goal:** Deliver instantaneous product browsing and frictionless checkout.

1. **Product Store Client-Side SWR Caching**:
   - Implemented Stale-While-Revalidate pattern with 3-minute freshness TTL in [`productStore.js`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/store/productStore.js).
   - In-flight request deduplication prevents concurrent duplicate catalog fetches.
   - Non-blocking background revalidation eliminates UI loading spinners when navigating back/forward.
2. **Category Store SWR Caching**:
   - Added 5-minute freshness TTL and in-flight request deduplication to [`categoryStore.js`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/store/categoryStore.js).
3. **Cloudinary Asset Optimization Verified**:
   - Verified that [`productCardHelpers.js`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/components/product-card/utils/productCardHelpers.js) and [`productUtils.js`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/lib/productUtils.js) route all product and swatch images through `f_auto,q_auto,dpr_auto,w_600` transforms.
   - Verified `loading="lazy"` and `decoding="async"` across mobile and desktop image viewports in [`ProductCardImage.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/components/product-card/components/ProductCardImage.jsx).
4. **Production Build Verified**:
   - `npm run build` executed and passed cleanly with 0 errors.

---

### ✅ PHASE 5: Migration Architecture Consolidation (COMPLETED)
**Goal:** Unify fragmented migration scripts into a clean, unified structure.

1. **Created Dedicated CLI Migration Runner**:
   - [`backend/migrations/run.php`](file:///c:/xampp/htdocs/backend/migrations/run.php): Provides a single, clean command (`php migrations/run.php`) to safely run all migrations, verify/create tables, alter missing columns, build compound indexes, and seed metadata.
2. **Unified On-Demand Web Migrations**:
   - [`backend/index.php`](file:///c:/xampp/htdocs/backend/index.php#L21-L26): Standardized `?migrate=true` endpoint to call `MigrationRunner::run($pdo)` directly with plain-text execution streaming.
3. **Safely Retired Duplicate Legacy Migration Files**:
   - Deprecated and forwarded [`config/migration.php`](file:///c:/xampp/htdocs/backend/config/migration.php) and [`config/schema_safety.php`](file:///c:/xampp/htdocs/backend/config/schema_safety.php) into the unified `MigrationRunner` architecture.
4. **Verified Full Migration Run**:
   - Executed `php migrations/run.php` — 22 tables, 50+ columns, 30+ indexes, and badge seed data verified with 0 errors.

---

---

## 🛡️ PART 3: ADVANCED SECURITY AUDIT & RACE CONDITION PREVENTION ARCHITECTURE

Following a complete security, concurrency, and architecture audit of both **Backend (PHP/MySQL)** and **Frontend (React/Vite)**, this section outlines all identified vulnerabilities, race conditions, atomic prevention techniques, and an actionable phased implementation roadmap.

```mermaid
graph TD
    A[Security & Concurrency Hardening] --> B[Race Condition Prevention]
    A --> C[Access Control & Endpoint Lockdown]
    A --> D[Authentication & OTP Hardening]
    A --> E[Transport, Headers & Sanitization]

    B --> B1[Stock Overselling: Atomic Variant Reservation]
    B --> B2[Promo Codes: Conditional Atomic Increment]
    B --> B3[Loyalty Points: Atomic Balance Deductions & Claims]

    C --> C1[Remove /debug-db Public Exposure]
    C --> C2[Lock /upload/image with Auth & Magic Bytes]
    C --> C3[Enforce Admin Role on Returns & Surveys]
    C --> C4[Hardening .htaccess for .env, .cache, logs]

    D --> D1[OTP Expiration 10m & Attempt Rate Limiting]
    D --> D2[Remove Public Plaintext otp_log.txt]
    D --> D3[Anti-Spoofing IP Resolution in RateLimiter]

    E --> E1[Valid CORS Headers & Origin Whitelist]
    E --> E2[HTTP Defense Headers: nosniff, SAMEORIGIN]
    E --> E3[Mask Raw PDO SQL Errors in 500 Responses]
    E --> E4[DOMPurify in Frontend dangerouslySetInnerHTML]
```

---

### ⚡ 1. Deep Race Condition Analysis & Atomic Prevention Techniques

Race conditions occur when multiple concurrent HTTP requests read identical state before either commits a mutation, allowing business limits (stock, promo usage, loyalty balance) to be bypassed.

#### 🔴 Race Condition 1: Inventory Overselling & Stock Capping
* **Affected Files:** [`StockReservationService.php`](file:///c:/xampp/htdocs/backend/helpers/inventory/StockReservationService.php#L115-L158), [`OrderCheckoutService.php`](file:///c:/xampp/htdocs/backend/controllers/orders/services/OrderCheckoutService.php#L170-L213)
* **Vulnerability:**
  1. `OrderCheckoutService::processCheckout()` does not perform pre-deduction inventory validation before creating the order.
  2. Inside `StockReservationService::deductItemsStock()`, variant stock deduction is calculated as:
     ```php
     $sizeObj['stock'] = max(0, intval($sizeObj['stock'] ?? 0) - $qtyToDeduct);
     ```
  3. If variant stock is `1`, and two users checkout concurrently:
     - User 1 deducts 1 &rarr; stock becomes `0`.
     - User 2 deducts 1 &rarr; `max(0, 0 - 1)` sets stock to `0`, and the order completes successfully!
     - **Result:** Severe overselling. The store owes 2 physical items while having only 1 in inventory.
* **Atomic Solution:**
  - Shift stock reservation inside the order transaction with immediate abort on stock deficiency:
  - During `deductItemsStock()`, lock product rows using `SELECT inventory FROM products WHERE id = ? FOR UPDATE`.
  - Check if `available_stock < requested_quantity`.
  - If insufficient: immediately throw `OutOfStockException`, abort order creation, and trigger `PDO::rollBack()`.
  - Never clamp with `max(0, ...)`.

#### 🔴 Race Condition 2: Promo Code `max_uses` Limit Bypass
* **Affected Files:** [`PromotionHelper.php`](file:///c:/xampp/htdocs/backend/helpers/PromotionHelper.php#L42-L44), [`OrderCheckoutService.php`](file:///c:/xampp/htdocs/backend/controllers/orders/services/OrderCheckoutService.php#L50-L67)
* **Vulnerability:**
  1. `PromotionHelper::validate()` checks `if ($promo['max_uses'] !== null && $promo['uses'] >= $promo['max_uses'])` before `beginTransaction()`.
  2. If a promo code has 1 use remaining (`uses = 99, max_uses = 100`), 10 customers submitting checkout at the exact same second will all pass validation.
  3. Each then executes `UPDATE promotions SET uses = uses + 1 WHERE id = ?`.
  4. **Result:** `uses` becomes 109, exceeding the company's financial discount cap.
* **Atomic Solution:**
  - Replace non-atomic increment with a single conditional atomic SQL update:
    ```sql
    UPDATE promotions 
    SET uses = uses + 1 
    WHERE id = :id 
      AND (max_uses IS NULL OR uses < max_uses)
    ```
  - Inspect `$stmt->rowCount()`. If rows affected == `0`, promo limit has been exhausted concurrently; immediately rollback and reject checkout with "Promo code limit reached".

#### 🔴 Race Condition 3: Loyalty Points Double-Awarding on Delivery
* **Affected Files:** [`OrderLoyaltyService.php`](file:///c:/xampp/htdocs/backend/controllers/orders/services/OrderLoyaltyService.php#L27-L42), [`PostExOrderService.php`](file:///c:/xampp/htdocs/backend/controllers/orders/services/PostExOrderService.php#L196-L200)
* **Vulnerability:**
  1. In `awardLoyaltyPointsForOrder()`, the check `(int)$order['points_awarded'] !== 0` is evaluated before starting the transaction.
  2. If PostEx tracking sync runs concurrently with an admin manual status update to 'delivered', both threads see `points_awarded == 0`.
  3. Both threads award points (`UPDATE users SET loyalty_points = loyalty_points + ?`).
  4. **Result:** Customer receives double reward points.
* **Atomic Solution:**
  - Perform an atomic conditional claim before crediting user points:
    ```sql
    UPDATE orders 
    SET points_awarded = 1 
    WHERE id = :orderId 
      AND status = 'delivered' 
      AND points_awarded = 0
    ```
  - Only execute user points addition if `$stmt->rowCount() === 1`. If `0`, another worker has already awarded points.

#### 🔴 Race Condition 4: User Loyalty Points Double-Spending
* **Affected Files:** [`OrderCheckoutService.php`](file:///c:/xampp/htdocs/backend/controllers/orders/services/OrderCheckoutService.php#L216-L219)
* **Vulnerability:**
  - Points deduction executes: `UPDATE users SET loyalty_points = GREATEST(0, loyalty_points - ?) WHERE id = ?`.
  - If a user sends two checkout requests in parallel with all their points, both may succeed and cause double redemption.
* **Atomic Solution:**
  - Enforce atomic conditional deduction:
    ```sql
    UPDATE users 
    SET loyalty_points = loyalty_points - :points 
    WHERE id = :userId 
      AND loyalty_points >= :points
    ```
  - If `$stmt->rowCount() === 0`, cancel checkout with "Insufficient loyalty points".

---

### 🛡️ 2. Comprehensive Security Vulnerabilities & Attack Vectors

| # | Vulnerability | Severity | Location | Attack Vector / Impact | Proposed Remediation |
| :- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Public Database Dump (`/debug-db`)** | 🚨 **Critical** | [`routes/api.php`](file:///c:/xampp/htdocs/backend/routes/api.php#L334-L347) | Anyone can send `GET /backend/debug-db` and download customer PII (names, phones, emails, addresses, orders) and table schemas without authentication. | Completely remove `/debug-db` or disable it in production environments. |
| **2** | **Unauthenticated File Upload** | 🚨 **Critical** | [`routes/api.php`](file:///c:/xampp/htdocs/backend/routes/api.php#L196), [`ImageUploadController.php`](file:///c:/xampp/htdocs/backend/controllers/ImageUploadController.php#L8-L70) | Anyone can upload up to 100MB files to the store's Cloudinary account. File MIME type is read from client header without checking server magic bytes. | Add `authMiddleware()`, verify magic bytes via PHP `finfo`, enforce strict file extension allowlist. |
| **3** | **Sensitive File Download via Web Server** | 🚨 **Critical** | [`backend/.htaccess`](file:///c:/xampp/htdocs/backend/.htaccess) | Apache does not deny access to `.env`, `.git`, `.cache`, `otp_log.txt`. Attackers can directly download `.env` and steal database credentials, SMTP keys, and JWT secrets. | Add `<FilesMatch "^(\.env|\.git|.*\.cache|.*\.log|otp_log\.txt)">` Deny rules in `.htaccess`. |
| **4** | **Broken Access Control on Returns** | ⚠️ **High** | [`ReturnController.php`](file:///c:/xampp/htdocs/backend/controllers/returns/ReturnController.php#L22-L115) | `GET /returns` and `PUT /returns/:id/status` do not check for admin privileges. Any customer with a JWT can view all customer returns and alter their statuses. | Enforce `$role === 'admin'` check for viewing all returns and status modification. |
| **5** | **Broken Access Control on Surveys** | ⚠️ **High** | [`SurveyController.php`](file:///c:/xampp/htdocs/backend/controllers/SurveyController.php#L33-L90), [`routes/api.php`](file:///c:/xampp/htdocs/backend/routes/api.php#L472) | `GET /admin/surveys` has no admin check in controller. Unauthenticated or non-admin users can read survey responses and emails. | Add strict `requireAdmin()` validation. |
| **6** | **OTP Without Expiry & Plaintext Logging** | ⚠️ **High** | [`OtpVerificationService.php`](file:///c:/xampp/htdocs/backend/helpers/auth/OtpVerificationService.php#L34-L116) | OTP has no timestamp expiration (`otp_expires_at` column is missing). OTP remains valid forever until used. On localhost, plaintext OTPs are logged into publicly readable `otp_log.txt`. | Add `otp_expires_at` (10 min TTL), attempt count tracking (lockout after 5 attempts), delete `otp_log.txt`. |
| **7** | **Rate Limiter IP Spoofing** | ⚠️ **Medium** | [`RateLimiter.php`](file:///c:/xampp/htdocs/backend/middleware/RateLimiter.php#L4-L13) | Blindly trusts `HTTP_X_FORWARDED_FOR` without validating trusted proxies. Attackers can bypass login/checkout rate limiting by sending random fake IP headers. | Restrict `X-Forwarded-For` inspection only to verified Cloudflare/reverse proxy IPs; default to `REMOTE_ADDR`. |
| **8** | **CORS Configuration Flaws & Missing Headers** | ⚠️ **Medium** | [`cors.php`](file:///c:/xampp/htdocs/backend/config/cors.php#L16-L38) | Fallback issues `Access-Control-Allow-Origin: *` while `Access-Control-Allow-Credentials: true` is sent (invalid combination). Allows arbitrary IP origins via loose regex. Missing basic HTTP security headers. | Whitelist strict domains, remove wildcard with credentials, add `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`. |
| **9** | **Information Disclosure via 500 Responses** | ⚠️ **Medium** | Controllers across backend | Catch blocks return `"details" => $e->getMessage()`, exposing database table names, SQL syntax, and file paths to users on query failure. | Mask internal error details in API responses unless in explicit local debug mode. |
| **10** | **Frontend Stored XSS Mitigation** | ⚠️ **Medium** | [`CustomPage.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/CustomPage.jsx#L35), [`CheckoutPolicyModal.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/checkout/components/CheckoutPolicyModal.jsx#L102-L138) | `dangerouslySetInnerHTML` is rendered without HTML sanitization. If an admin or API injects malicious script tags, it executes in users' browsers. | Sanitize HTML inputs using `DOMPurify.sanitize()` before rendering. |

---

## 🚀 ACTIONABLE SECURITY & CONCURRENCY IMPLEMENTATION PHASES

To implement these advanced security features and race condition protections safely without disrupting customer traffic, the work is organized into **4 Structured Phases**:

```mermaid
graph LR
    P1[SECURITY PHASE 1<br/>Race Conditions & Atomic DB Locking] --> P2[SECURITY PHASE 2<br/>Access Control & Sensitive Endpoints]
    P2 --> P3[SECURITY PHASE 3<br/>Auth, OTP & Rate Limiter Hardening]
    P3 --> P4[SECURITY PHASE 4<br/>CORS, Headers & Input Sanitization]
```

---

### ✅ SECURITY PHASE 1: Race Condition Elimination & Transaction Atomicity (COMPLETED)
**Goal:** Make checkout, inventory, promo codes, and loyalty points 100% concurrency-safe and immune to overselling, race conditions, or double-spending.

1. **Atomic Inventory Reservation in `StockReservationService.php`**:
   - Implemented `OutOfStockException` (HTTP 409).
   - In `deductItemsStock()`, each product is locked using `SELECT id, name, inventory, stock_count FROM products WHERE id = ? FOR UPDATE`.
   - Checks if `$currentStock < $qtyToDeduct`. If insufficient, throws `OutOfStockException` with exact product name, color, and size.
   - Removed all `max(0, ...)` deduction clamping. Zero overselling is guaranteed.
2. **Atomic Checkout Scoping in `OrderCheckoutService.php`**:
   - Stock deduction executes inside `beginTransaction()` before order insertion.
   - Catches `OutOfStockException`, executes `PDO::rollBack()`, and returns HTTP 409 with structured `{ error, out_of_stock }` response.
3. **Conditional Atomic Promo Code Usage in `OrderCheckoutService.php`**:
   - Replaced unlocked update with atomic statement: `UPDATE promotions SET uses = uses + 1 WHERE id = ? AND (max_uses IS NULL OR uses < max_uses) AND active = 1`.
   - Rollback immediately triggers if affected rows == `0`.
4. **Loyalty Balance Deductions & Double-Awarding Prevention**:
   - In `OrderCheckoutService.php`: enforced atomic balance reduction: `UPDATE users SET loyalty_points = loyalty_points - ? WHERE id = ? AND loyalty_points >= ?`.
   - In `OrderLoyaltyService.php`:
     - Double-Awarding: `UPDATE orders SET points_awarded = 1 WHERE id = ? AND points_awarded = 0 AND status = 'delivered'`. Only credits user if row count == 1.
     - Double-Refund: `UPDATE orders SET points_used = 0 WHERE id = ? AND points_used > 0`. Only refunds user if row count == 1.
5. **Live Verification & Concurrency Tests Passed**:
   - **Test 1 (Overselling)**: Product #67 Night Suit Set tested with stock = 0. Attempting purchase cleanly triggered `OutOfStockException` (HTTP 409: `Insufficient stock for "Night Suit Set (S)". Only 0 remaining, 5 requested`).
   - **Test 2 (Duplicate Loyalty Credit)**: Mock delivered Order #37 tested with concurrent claims. Claim 1 succeeded (`TRUE`), Claim 2 was safely blocked (`FALSE`). Zero double-awarding.
   - **Test 3 (Promo Code Max Uses Race)**: Test promo created with `max_uses = 1`. Thread 1 affected 1 row (`Passed`), Thread 2 affected 0 rows (`Blocked`). Zero limit breach.

---

### ✅ SECURITY PHASE 2: Access Control, Sensitive Endpoint Lockdown & Apache Shield (COMPLETED)
**Goal:** Close all open data leaks, protect sensitive server files, and enforce strict Role-Based Access Control (RBAC).

1. **Eliminated Public Debug Route**:
   - Completely deleted unauthenticated `/debug-db` from [`routes/api.php`](file:///c:/xampp/htdocs/backend/routes/api.php). Requests now receive strict `404 API endpoint not found`.
2. **Locked `/upload/image` Behind Authentication & Server Magic Bytes**:
   - Enforced `authMiddleware()` on `/upload/image` route (anonymous access blocked with `HTTP 401`).
   - In [`ImageUploadController.php`](file:///c:/xampp/htdocs/backend/controllers/ImageUploadController.php), replaced client-supplied MIME trust with server-side `finfo_file()` magic byte inspection and strict extension whitelist (`jpg`, `png`, `webp`, `mp4`, etc.).
3. **Apache `.htaccess` Server Shielding Applied**:
   - Added `Options -Indexes` in [`backend/.htaccess`](file:///c:/xampp/htdocs/backend/.htaccess) to stop all directory browsing.
   - Added `<FilesMatch>` rules to deny direct HTTP downloads of `.env`, `.git`, `*.cache`, `*.log`, `otp_log.txt`, and `*.sql` (`HTTP 403 Forbidden`).
   - Blocked direct HTTP traversal to `cache/`, `storage/`, `migrations/`, and `workers/` directories.
4. **Enforced Admin RBAC on Returns & Surveys**:
   - In [`ReturnController.php`](file:///c:/xampp/htdocs/backend/controllers/returns/ReturnController.php): restricted `index()` and `updateStatus()` with strict `requireAdmin()` check (`HTTP 403`). Removed boot-time `ensureTable()` DDL query from constructor.
   - In [`SurveyController.php`](file:///c:/xampp/htdocs/backend/controllers/SurveyController.php): added `requireAdmin()` on `getAll()` to protect customer survey responses and email addresses.
   - In [`AddressController.php`](file:///c:/xampp/htdocs/backend/controllers/user/AddressController.php): eliminated runtime `ensureTable()` DDL query; migrated tables properly into [`TableDefinitions.php`](file:///c:/xampp/htdocs/backend/migrations/services/TableDefinitions.php).
5. **Live Verification & Security Tests Passed**:
   - **Test 1 (`GET /backend/debug-db`)**: Responded with `HTTP 404 API endpoint not found` (`Passed`).
   - **Test 2 (`POST /backend/upload/image` unauthenticated)**: Responded with `HTTP 401 Unauthorized` (`Passed`).
   - **Test 3 (`GET /backend/admin/surveys` unauthenticated)**: Responded with `HTTP 401 Unauthorized` (`Passed`).
   - **Test 4 (`GET /backend/returns` unauthenticated)**: Responded with `HTTP 401 Unauthorized` (`Passed`).
   - **Test 5 (`GET /backend/.env` direct access)**: Apache blocked directly with `HTTP 403 Forbidden` (`Passed`).

---

### 🔹 SECURITY PHASE 3: Authentication, OTP Security & Anti-Spoofing Rate Limiting
**Objective:** Harden authentication, prevent brute-force attacks, and eliminate OTP replay vulnerabilities.

1. **OTP Expiry & Attempt Limiting Schema**:
   - Added safe migration columns in [`ColumnMigrations.php`](file:///c:/xampp/htdocs/backend/migrations/services/ColumnMigrations.php): `otp_expires_at (DATETIME)`, `otp_attempts (INT DEFAULT 0)` with index on `users(otp_expires_at)`.
   - Executed through unified migration runner [`migrations/run.php`](file:///c:/xampp/htdocs/backend/migrations/run.php).
2. **Hardened [`OtpVerificationService.php`](file:///c:/xampp/htdocs/backend/helpers/auth/OtpVerificationService.php)**:
   - When generating OTP, set `otp_expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE)` and reset `otp_attempts = 0`.
   - In `verifyOtp()`: evaluates `(otp_expires_at IS NOT NULL AND otp_expires_at < NOW()) AS is_otp_expired` directly in MySQL to prevent timezone drift between PHP and MySQL. If expired, rejects immediately with `"Verification code has expired"`.
   - Increments `otp_attempts` on each failed try. If `otp_attempts >= 5`, permanently locks down the OTP: `"Too many failed verification attempts. This code has been locked for security. Please request a new code."`
   - Timing-safe comparison enforced via `hash_equals()`.
   - Completely deleted and blocked plaintext `backend/otp_log.txt`.
3. **Anti-Spoofing IP Resolution in [`RateLimiter.php`](file:///c:/xampp/htdocs/backend/middleware/RateLimiter.php)**:
   - Replaced naive `X-Forwarded-For` parsing with proxy-aware resolution.
   - `HTTP_X_FORWARDED_FOR` is strictly rejected unless `REMOTE_ADDR` originates from trusted private network ranges (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`) or authenticated Cloudflare edge headers.
   - Defaults to immutable `$_SERVER['REMOTE_ADDR']`.
4. **JWT Security Verification**:
   - Cryptographically random 256-bit secret generated via `bin2hex(random_bytes(32))`.
   - Timing-safe HMAC-SHA256 signature verification using `hash_equals()`.
   - Token expiry (`exp`) enforced across all protected API endpoints.
5. **Live Verification & Tests Passed (`test_security_phase3.php`)**:
   - **Test 1 (OTP 10-Minute Expiry)**: Artificially expired OTP rejected cleanly with `valid: false` (`Passed`).
   - **Test 2 (OTP Brute-Force Lockout)**: After 5 incorrect attempts, even the correct OTP was strictly blocked with account lockout message (`Passed`).
   - **Test 3 (Rate Limiter Anti-Spoofing)**: Attacker sending spoofed `X-Forwarded-For: 8.8.8.8` from public IP had spoofed header rejected; rate limiter keyed strictly on `REMOTE_ADDR` (`Passed`).
   - **Test 4 (JWT Expiry Enforcement)**: Expired JWT tokens evaluated to `null` (`Passed`).

---

### 🔹 SECURITY PHASE 4: Transport Security, Headers, Input Sanitization & Error Masking
**Objective:** Secure client-server communication, eliminate XSS vectors, and prevent database information leakage.

1. **CORS & HTTP Security Headers in [`cors.php`](file:///c:/xampp/htdocs/backend/config/cors.php)**:
   - Configured strict allowed origins whitelist including live domain `https://www.underpure.com`, `https://underpure.com`, HTTP variants, and local Vite dev ports (`http://localhost:5173`, `http://localhost:3000`).
   - Eliminated dangerous wildcard `*` with credentials. Disallowed origins receive no credentials and no origin reflection.
   - Added defense-in-depth HTTP security headers to all responses:
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: SAMEORIGIN`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Permissions-Policy: geolocation=(), camera=(), microphone=()`
2. **Production Error Masking**:
   - Registered global `set_exception_handler` invoking [`ErrorHandler::respondWithError()`](file:///c:/xampp/htdocs/backend/helpers/ErrorHandler.php) in [`cors.php`](file:///c:/xampp/htdocs/backend/config/cors.php).
   - Internal database/PDO exception details, file paths, and stack traces are logged securely to the server error log and completely masked from client JSON API responses.
3. **Frontend XSS Sanitization with `DOMPurify`**:
   - Installed `dompurify` package in Frontend.
   - Created centralized [`sanitizeHtml.js`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/utils/sanitizeHtml.js) utility.
   - Wrapped all 5 occurrences of `dangerouslySetInnerHTML`:
     - [`CustomPage.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/CustomPage.jsx) (CMS custom page content)
     - [`CheckoutPolicyModal.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/checkout/components/CheckoutPolicyModal.jsx) (4 policy sections: Refund, Terms, Privacy, Shipping)
     - [`ProductDescriptionSection.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/product-detail/components/ProductDescriptionSection.jsx) (Product long description)
     - [`ProductInfoAccordion.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/product-detail/components/ProductInfoAccordion.jsx) (Product accordion items)
     - [`ProductSizeGuideModal.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/product-detail/components/ProductSizeGuideModal.jsx) (Size guide footer note)
   - Tested production build with `npm run build`: built in 19.23s with 0 errors.
4. **Backend Review & Note Sanitization**:
   - In [`ReviewMutationService.php`](file:///c:/xampp/htdocs/backend/controllers/reviews/services/ReviewMutationService.php): comment, title, age range, size purchased, and true size sanitized using `htmlspecialchars(strip_tags(...), ENT_QUOTES, 'UTF-8')`.
   - In [`OrderCheckoutService.php`](file:///c:/xampp/htdocs/backend/controllers/orders/services/OrderCheckoutService.php): customer shipping name, address, city, zip, and gift notes sanitized before database insertion.
5. **Live Verification & Tests Passed (`test_security_phase4.php`)**:
   - **Test 1 (CORS & Security Headers)**: `https://www.underpure.com` origin allowed with credentials; `nosniff`, `SAMEORIGIN`, `strict-origin` headers present (`Passed`).
   - **Test 2 (Malicious Origin Rejection)**: `https://evil-attacker.com` received no origin reflection and credentials denied (`Passed`).
   - **Test 3 (Backend Input Sanitization)**: Raw script tags stripped cleanly while preserving harmless text (`Passed`).
   - **Test 4 (Production Error Masking)**: Database exception masked to generic `"error": "An unexpected server error occurred."` (`Passed`).

---

## 📊 Summary Comparison: Before vs. After Security Hardening Plan

| Security / Concurrency Vector | Current State | Hardened State (Post-Implementation) | Status |
| :--- | :--- | :--- | :--- |
| **Inventory Checkout Concurrency** | `max(0, ...)` deduction; allows double-order overselling | Strict row lock `FOR UPDATE` + atomic rollback on stock deficit | ✅ Complete |
| **Promo Code Usage Limits** | Unlocked pre-validation; concurrent checkouts exceed `max_uses` | Single atomic query `WHERE (max_uses IS NULL OR uses < max_uses)` | ✅ Complete |
| **Loyalty Points Double-Awarding** | Checked outside transaction; double points awarded on status sync | Conditional atomic claim `UPDATE ... WHERE points_awarded = 0` | ✅ Complete |
| **Public Database Exposure** | `/debug-db` openly accessible without authentication | Endpoint removed / strictly restricted to local debug | ✅ Complete |
| **File Upload Authorization** | Publicly accessible `/upload/image`; trusts client MIME headers | Restricted to authenticated users + PHP `finfo` magic bytes check | ✅ Complete |
| **Web Server File Security** | `.env` and `cache/` accessible if requested directly | Apache `.htaccess` denies access to sensitive files & logs | ✅ Complete |
| **Admin Route Authorization** | `returns` and `surveys` lack admin role verification | Strict `$_REQUEST['user']['role'] === 'admin'` enforced | ✅ Complete |
| **OTP Verification Security** | No expiration timestamp, unlimited brute-force attempts, logged to file | 10-minute expiry, max 5 attempts lockout, plaintext log removed | ✅ Complete |
| **Rate Limiter IP Spoofing** | Blindly trusts client-supplied `X-Forwarded-For` header | Validates proxy source; defaults to immutable `REMOTE_ADDR` | ✅ Complete |
| **CORS & HTTP Security Headers** | Wildcard conflict with credentials; missing defense headers | Whitelist origin only (`www.underpure.com`), `nosniff`, `SAMEORIGIN` | ✅ Complete |
| **Frontend HTML Injection (XSS)** | Raw `dangerouslySetInnerHTML` rendering | Sanitized via `DOMPurify.sanitize()` across all 5 components | ✅ Complete |
| **API Error Leakage** | Raw PDO database exception details returned to client | Masked generic messages in production; internal logging | ✅ Complete |

---

# ✉️ UNDERPURE LUXURY EMAIL ARCHITECTURE & REDESIGN PLAN

## 1. Deep Analysis: Current Email Deficiencies & Pain Points

After a thorough inspection of the backend email infrastructure ([`EmailHelper.php`](file:///c:/xampp/htdocs/backend/helpers/EmailHelper.php), [`EmailTemplates.php`](file:///c:/xampp/htdocs/backend/helpers/email/EmailTemplates.php), [`TransactionalEmails.php`](file:///c:/xampp/htdocs/backend/helpers/email/TransactionalEmails.php), [`NotificationEmailTemplate.php`](file:///c:/xampp/htdocs/backend/helpers/notifications/NotificationEmailTemplate.php), and worker scripts), several critical structural, aesthetic, and cross-client compatibility issues were identified:

```mermaid
graph TD
    A[Order Placed / Status Event] --> B{Two Competing Engines}
    B -->|Path 1: Worker & StatusService| C[EmailTemplates.php + TransactionalEmails.php]
    B -->|Path 2: NotificationHelper| D[NotificationEmailTemplate.php]
    
    C --> E[Light background + Clashing Yellow-Gold #C5A059 + Arial/Georgia]
    D --> F[Hardcoded pitch-black #0a0a0a + Rose #d4a59a]
    
    E --> G[Gmail Inversion Disaster: Inverts backgrounds unpredictably]
    F --> H[Gmail Light Mode Disaster: Dark block in light inboxes]
    
    G & H --> I[Broken Brand Perception & Contrast Failure]
```

### Key Technical & Visual Deficiencies:
1. **Engine Fragmentation**: 
   - Two entirely divergent template engines exist side-by-side: `helpers/email/EmailTemplates.php` and `helpers/notifications/NotificationEmailTemplate.php`. Customers receive totally different email designs depending on whether the order event was triggered via `NotificationHelper` or `EmailHelper`.
2. **Brand Visual Disconnect**:
   - UnderPure's storefront is defined by high-fashion minimalism: editorial serif headings (`Dala Floda` / `Cormorant Garamond`), clean sans-serif body (`Inter`), deep onyx black (`#111111`), pristine ivory/white (`#FFFFFF`), and soft champagne/beige neutrals (`#E6DCD3`).
   - Current emails use generic Arial/Georgia, high-saturation yellow-gold (`#C5A059`), or pitch-black blocks that look like tech terminal receipts rather than an haute-couture fashion house.
3. **Gmail Dark Mode & Light Mode Rendering Failures**:
   - **Gmail Android (Full Inversion)**: Android Gmail automatically inverts tables with dark background-colors into muddy gray or white, and turns white text into unreadable gray. Current templates lack linear-gradient background protection, causing the header and CTA buttons to wash out.
   - **Gmail iOS & Web (Partial Inversion)**: Current emails lack `<meta name="color-scheme" content="light dark">` and `supported-color-schemes` tags, causing inverted elements to have mismatched borders and low contrast.
   - **Missing Inline Fallbacks**: Gmail frequently strips or ignores `<style>` tags in certain account configurations (IMAP/non-Google synced accounts). When `<style>` is stripped, classes fail, collapsing tables and breaking layout.
4. **Lack of Dynamic Store Variables**:
   - Logos, support emails, contact phone, and store social links are hardcoded rather than dynamically retrieving updated values from `site_settings`.

---

## 2. Visual Identity & Brand System (Store Mirroring)

The redesigned emails will directly mirror the typography, color hierarchy, and spacing of the **UnderPure 5** storefront:

| Design Element | Storefront Reference | Email Design System Specification |
| :--- | :--- | :--- |
| **Header Backdrop** | Minimalist Onyx (`#111111`) | Deep Luxury Charcoal (`#111111`) with champagne hairline bottom border (`#EAE6E1`) |
| **Brand Logo** | Dala Floda / Cormorant Serif | High-tracking typographic wordmark `UNDERPURE` in crisp white (`#FFFFFF`) with letter-spacing `0.24em`, subtext: `HAUTE COUTURE & LUXURY LINGERIE` |
| **Email Card Canvas** | Crisp Ivory / White (`#FFFFFF`) | `#FFFFFF` card on `#F7F7F6` canvas (Light Mode) / `#1C1C1C` on `#121212` (Dark Mode) |
| **Typography - Headings** | Editorial Serif (`Dala Floda`) | `Cormorant Garamond, "Didot", "Bodoni MT", "Georgia", serif` (300/400 weight, uppercase, letter-spacing `0.15em`) |
| **Typography - Body** | Clean Modern (`Inter`) | `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif` (`line-height: 1.7`, `font-size: 14px`) |
| **Primary Buttons** | Monochromatic Solid Black | `#111111` solid background with `#FFFFFF` text, `letter-spacing: 0.22em`, sharp 2px radius, uppercase, hover brightness |
| **Accents & Badges** | Champagne Accent (`#e6dcd3`) | Soft Champagne Gold (`#D4AF37` / `#D4A59A`), muted badge pills with soft borders |
| **Borders & Dividers** | Subtle Hairline Grayscale | `1px solid #ECEAE7` in Light Mode / `1px solid #2B2B2B` in Dark Mode |

---

## 3. Cross-Client Technical Resilience: Gmail Dark & Light Mode Strategy

To guarantee that every email renders identically across **Gmail (Web, iOS, Android), Apple Mail, Outlook, and Yahoo Mail**, the following defensive engineering rules will be implemented:

```mermaid
graph LR
    subgraph Client Headers
        A1[Meta color-scheme: light dark]
        A2[Supported-color-schemes: light dark]
    end

    subgraph CSS Defense
        B1[media prefers-color-scheme: dark]
        B2[data-ogsc / data-ogsb for Outlook]
        B3[Linear-Gradient BG hack for Gmail Android]
    end

    subgraph Inline Fallbacks
        C1[100% Inline CSS on every td, p, span]
        C2[MSO Table Ghosting for Outlook Desktop]
        C3[High-contrast text tokens]
    end

    Client Headers --> RenderingEngine[Robust Cross-Client Engine]
    CSS Defense --> RenderingEngine
    Inline Fallbacks --> RenderingEngine
```

1. **Dual Color-Scheme Meta Tags**:
   ```html
   <meta name="color-scheme" content="light dark">
   <meta name="supported-color-schemes" content="light dark">
   ```
2. **Gmail Android Inversion Neutralizer (`linear-gradient` trick)**:
   - Android Gmail strips plain `background-color: #111111;` when applying dark/light inversion, but **leaves CSS gradients untouched**.
   - By applying:
     ```css
     background-color: #111111;
     background-image: linear-gradient(#111111, #111111);
     ```
     to the header and buttons, Gmail Android is completely prevented from inverting black luxury elements into white or washed-out gray.
3. **Dual-Mode High Contrast Matrix**:
   - **Light Mode**: Canvas `#F7F7F6`, Container `#FFFFFF`, Primary Text `#111111`, Secondary Text `#666666`, Dividers `#ECEAE7`.
   - **Dark Mode**: Canvas `#121212`, Container `#1C1C1C`, Primary Text `#F5F5F5`, Secondary Text `#A8A8A8`, Dividers `#2B2B2B`.
4. **Inline-First Architecture**:
   - Every single element will have strict inline styles for base rendering, augmented by class-based dark mode overrides (`@media (prefers-color-scheme: dark)` and `[data-ogsc]`).

---

## 4. Unified Architecture: `LuxuryEmailLayout.php` & Component Partials

We will replace the conflicting duplicate files with a single, modular luxury template framework:

```
c:/xampp/htdocs/backend/helpers/email/
├── LuxuryEmailLayout.php        <-- Master responsive layout engine (Light/Dark resilient)
├── EmailComponents.php         <-- Reusable UI partials (Buttons, Receipt Tables, Badges, Cards)
├── TransactionalEmails.php     <-- Pure business logic & payload assembler
└── EmailTransport.php          <-- PHPMailer SMTP dispatcher
```

### Modular UI Components in `EmailComponents.php`:
- **`renderHeader()`**: Dynamic UnderPure brand logo, tagline, and optional store announcement banner.
- **`renderHeroBanner($title, $subtitle, $badgeText)`**: Cormorant Garamond serif headline with letter-spaced subtitle and status badge.
- **`renderButton($url, $label)`**: Inversion-proof luxury action button with linear-gradient backing.
- **`renderOrderReceiptTable($items, $totals)`**: Elegant product breakdown with thumbnail support, variant tags (`Color / Size`), formatted Rs. pricing, and calculation breakdown.
- **`renderOtpBox($otpCode, $expiryMinutes)`**: Clean, high-impact security code display with dashed champagne border and mono/serif numerals.
- **`renderCardCallout($content, $icon)`**: Subdued luxury container for loyalty points balance, birthday greetings, or VIP privileges.
- **`renderFooter()`**: Concierge email, account management link, FAQ links, copyright, and confidentiality notice.

---

## 5. Inventory of Email Templates to Redesign (8 Core Templates)

| # | Template Name | Event / Trigger | Key Features in Redesign |
| :-: | :--- | :--- | :--- |
| **1** | **Welcome & Onboarding** | Customer registration / Google OAuth signup | Warm editorial greeting, UP Points signup bonus badge, brand ethos intro, "Discover Collection" luxury button. |
| **2** | **Order Confirmation** | Successful checkout / order worker dispatch | Comprehensive order receipt table, shipping address card, payment method indicator, tracking link, concierge support notice. |
| **3** | **Order Status Update** | Order status changes (Processing, Shipped, Delivered, Cancelled) | Visual progress indicator / badge, shipping courier details, tracking button, customer care links. |
| **4** | **Password Reset / OTP** | Forgot password / login verification | Prominent 6-digit OTP security card, 10-minute expiry warning, anti-phishing security reminder, timing protection note. |
| **5** | **Loyalty Points Credited** | Order delivered, review approved, tier reward | New points balance hero card, transaction reason, explanation of reward redemption, VIP tier status progress. |
| **6** | **Birthday Celebration** | Automated annual birthday cron (`birthday_wishes.php`) | Champagne celebratory card, complimentary birthday points gift, personalized shopping invitation. |
| **7** | **Exclusive Promo / Private Sale** | Admin promo campaign dispatch | High-fashion VIP invitation, stylized promo code badge with copy button, expiration timer, direct collection link. |
| **8** | **VIP Tier Upgrade** | Customer spend milestone / admin VIP grant | Black-tie luxury invitation layout, bulleted VIP perks card (free shipping, concierge care, early access), direct account access. |

---

## 6. Phased Implementation Roadmap

```mermaid
graph TD
    P1[Phase E1: Core Master Layout & Components] --> P2[Phase E2: Unification of All 8 Templates]
    P2 --> P3[Phase E3: Notification Pipeline Integration]
    P3 --> P4[Phase E4: Live Preview Harness & Cross-Client Validation]
```

### 🔹 Phase E1: Core Master Layout & Component Engine (✅ Completed)
- Created [`LuxuryEmailLayout.php`](file:///c:/xampp/htdocs/backend/helpers/email/LuxuryEmailLayout.php) with:
  - Responsive 600px fluid table container with MSO desktop compatibility conditionals.
  - Complete Gmail Dark Mode & Light Mode CSS rules (`<meta name="color-scheme" content="light dark">`, `linear-gradient` inversion defense, `@media (prefers-color-scheme: dark)`, `[data-ogsc]`).
  - High-fashion typography: `Cormorant Garamond` serif headings, `Inter` clean body, letter-spaced `UNDERPURE` wordmark.
  - 100% inline styles on all base tags for clients that strip `<style>`.
- Created [`EmailComponents.php`](file:///c:/xampp/htdocs/backend/helpers/email/EmailComponents.php) with modular methods:
  - `EmailComponents::button($url, $label, $align)`: Inversion-proof luxury CTA with linear gradient.
  - `EmailComponents::otpBox($otp, $expiryMinutes)`: High-security dashed card with Cormorant Garamond numerals.
  - `EmailComponents::orderTable($items, $total, ...)`: Itemized receipt with size/color metadata, complimentary shipping styling, and formatted totals.
  - `EmailComponents::calloutCard($content, $title, $highlight)`: Editorial card for points, tier perks, or announcements.
  - `EmailComponents::infoGrid($pairs)`: Label-value metadata table.
- Updated [`EmailTemplates.php`](file:///c:/xampp/htdocs/backend/helpers/email/EmailTemplates.php) to seamlessly delegate to `LuxuryEmailLayout` and `EmailComponents`, maintaining complete backwards compatibility.
- Live verification via `scratch/test_phase_e1.php`: All 6 structural, Gmail defense, and component tests passed cleanly (100% Success).

### 🔹 Phase E2: Redesigning All 8 Transactional Email Handlers (✅ Completed)
- Refactored [`TransactionalEmails.php`](file:///c:/xampp/htdocs/backend/helpers/email/TransactionalEmails.php) to use `LuxuryEmailLayout` and `EmailComponents` across all 8 core handlers:
  1. `sendWelcomeEmail()`: Editorial welcome letter, member privilege badge, UP Points bonus callout card, luxury CTA button.
  2. `sendOrderConfirmed()`: Atelier order confirmation, itemized receipt table (`size/color` variant metadata, complimentary shipping styling, formatted PKR prices), order reference pill, track status button.
  3. `sendOrderStatusUpdated()`: Dynamic status headline and badge (`SHIPPED`, `DELIVERED`, `CANCELLED`, etc.), customized editorial messaging, metadata information grid, and contextual CTA.
  4. `sendPasswordReset()`: High-security alert layout, 6-digit OTP verification card with Cormorant Garamond numerals, 10-minute expiry warning, anti-phishing note.
  5. `sendLoyaltyPointsUpdated()`: UP Loyalty Club card, points credited highlight (`+250 UP Points`), balance summary, and tier rewards button.
  6. `sendBirthdayWish()`: Editorial birthday card ("Happy Birthday, Lover"), celebratory points voucher card, and "Claim Birthday Gift" button.
  7. `sendPromoEmail()`: Private VIP invitation layout, discount code badge with expiration date notice, and "Shop The Collection" button.
  8. `sendVipUpgrade()`: Black-tie elite status invitation, bulleted VIP privileges card (free shipping, concierge care, early access), and direct account access button.
- Live verification via `scratch/test_phase_e2.php`: All 8 templates executed and rendered with 100% success.

### 🔹 Phase E3: Pipeline Unification & Redundancy Removal (✅ Completed)
- Bridged [`NotificationEmailTemplate.php`](file:///c:/xampp/htdocs/backend/helpers/notifications/NotificationEmailTemplate.php) directly to [`LuxuryEmailLayout.php`](file:///c:/xampp/htdocs/backend/helpers/email/LuxuryEmailLayout.php), completely eliminating the fragmented legacy `#0a0a0a` all-black template engine.
- Upgraded [`OrderPlacedNotification.php`](file:///c:/xampp/htdocs/backend/helpers/notifications/OrderPlacedNotification.php) to use `EmailComponents::orderTable()` and `EmailComponents::calloutCard()` for delivery destination and gift notes.
- Upgraded [`OrderStatusNotification.php`](file:///c:/xampp/htdocs/backend/helpers/notifications/OrderStatusNotification.php) to use `EmailComponents::infoGrid()`, `EmailComponents::calloutCard()`, and `EmailComponents::button()` across all status triggers (`shipped`, `delivered`, `returned`, `cancelled`, and default status transitions).
- Guaranteed 100% template alignment between both notification channels (`order_notification_worker.php` via `EmailHelper` and `NotificationHelper` via database notifications).
- Live verification via `scratch/test_phase_e3.php`: All 5 bridge outputs and instance checks passed with 100% success.

### 🔹 Phase E4: Live Preview Suite & Cross-Client Testing (✅ Completed)
- Created [`EmailPreviewService.php`](file:///c:/xampp/htdocs/backend/helpers/email/EmailPreviewService.php) with mock generator payloads across all 9 luxury email variations.
- Built interactive testing suite [`email_preview.php`](file:///c:/xampp/htdocs/backend/email_preview.php) accessible locally at `http://localhost/backend/email_preview.php`:
  - Instant template switcher across all 8 transactional notifications.
  - One-click toggle between **Standard Light Mode** and **Simulated Gmail Dark Mode**.
  - Viewport switcher between **Desktop (650px)** and **Mobile (375px)**.
  - Embedded responsive iframe for real-time visual inspection.
- Automated Cross-Client Checklist & Audit (`scratch/test_phase_e4.php`):
  - `Meta color-scheme: light dark`: Verified (`Passed`).
  - `Gmail Android linear-gradient background protection`: Verified (`Passed`).
  - `Cormorant Garamond Serif Headings & Inter Body`: Verified (`Passed`).
  - `MSO Table Conditionals & 600px Responsive Breakpoint`: Verified (`Passed`).
  - `Raw Rendering across all 9 templates in both Light & Dark modes`: 100% Passed.

---

### 🔹 Phase E5: Birthday Month UP Points Assignment & Celebration Email Dispatch (✅ Completed)
- **Automatic Dispatch on Login**:
  - In [`AuthLoginService.php`](file:///c:/xampp/htdocs/backend/controllers/auth/services/AuthLoginService.php):
    - When a customer logs in via password (`login()`), Google auth (`googleLogin()`), or OTP (`verifyOtpAndLogin()`):
      - Checks if the current month matches the customer's birthday month (`dob`) and they haven't received points for the current calendar year (`last_birthday_reward_year != currentYear`).
      - Retrieves the configured birthday bonus points from `site_settings` (`loyaltySettings` -> `birthdayBonus`, defaulting to 350 UP Points).
      - Atomically increments customer's `loyalty_points` in the database and updates `last_birthday_reward_year = currentYear`.
      - Automatically dispatches the luxury **Birthday Celebration Email** via `EmailHelper::sendBirthdayWish($user['email'], $user['name'] ?? 'Lover', $birthdayBonus)`.
      - Returns `birthdayReward: true` and `birthdayBonus` in the API JSON response to trigger celebratory toast and confetti in the frontend.
- **Daily Birthday Cron Script Synchronized**:
  - In [`cron/birthday_wishes.php`](file:///c:/xampp/htdocs/backend/cron/birthday_wishes.php):
    - Aligned `site_settings` query to check `setting_key IN ('loyaltySettings', 'loyalty_settings')`, ensuring exact configured bonus points (e.g. 350 UP Points) are awarded rather than falling back.
    - Updated customer name fallback to `'Lover'` if name is empty.
    - Verified daily batch processing and automated luxury email dispatch.
- **Live Verification (`scratch/test_birthday_dispatch.php`)**:
  - Verified points increment (+350 UP Points).
  - Verified `last_birthday_reward_year` update to prevent duplicate rewards.
  - Verified idempotency check: subsequent logins within the same year do NOT re-award points or duplicate emails.
  - Verified luxury birthday email generation containing `+350 UP Points` callout card, `"Happy Birthday, Lover"` headline, and `"Claim Your Birthday Gift"` CTA.

---

### 🔹 Phase E6: Order Lifecycle Email Redesign & PostEx Webhook Integration (✅ Completed)
**Objective:** Align the complete order lifecycle with luxury brand standards, eliminate double-email dispatches, and trigger distinct transactional emails at every milestone (Order Placed, Admin Confirmed, Admin Cancelled, PostEx Delivered with UP Points, PostEx Undelivered with No Points).

1. **Order Placed Successfully Email (Customer Checkout)**:
   - **Trigger**: Immediately upon placing an order (`POST /checkout` processed by background worker `order_notification_worker.php`).
   - **Template**: `TransactionalEmails::sendOrderPlaced()` / `EmailHelper::sendOrderPlaced()`.
   - **Luxury Aesthetics**: Features `Pending Verification` tag, itemized product table with size/color metadata, complimentary shipping row, delivery destination card, and "View Order Details" CTA.
   - **Deduplication**: Separated notification record insertion from email dispatch in `order_notification_worker.php` using `$notifier->sendOrderPlaced($order, false)` to eliminate previous duplicate email bug.

2. **Order Confirmed Email (Admin Acceptance & PostEx Dispatch)**:
   - **Trigger**: When Admin accepts order (`POST /orders/:id/accept` via `PostExOrderService::acceptOrder()`) or changes status to `confirmed` (`PUT /orders/:id` via `OrderStatusService::updateOrderStatus()`).
   - **Template**: `TransactionalEmails::sendOrderConfirmed()` / `EmailHelper::sendOrderConfirmed()`.
   - **Details**: `Confirmed & Processing` badge, PostEx consignment tracking card with direct tracking number link, itemized items summary, and discreet packaging assurance.

3. **Order Cancelled Email (Admin or Cancellation Notice)**:
   - **Trigger**: When Admin cancels an order (`POST /orders/:id/cancel` via `OrderStatusService::cancelOrder()` or status `cancelled`).
   - **Template**: `TransactionalEmails::sendOrderCancelled()` / `EmailHelper::sendOrderCancelled()`.
   - **Details**: `CANCELLED` status card, clear statement that any redeemed UP loyalty points have been restored to the customer's balance, stock restored to inventory, and direct WhatsApp Concierge CTA.

4. **PostEx Delivered with UP Points Credited Email**:
   - **Trigger**: When PostEx API status changes to `delivered` (via tracking status sync `syncPostExStatuses()`, order tracking `trackOrder()`, or webhook `handlePostExWebhook()`).
   - **Template**: `TransactionalEmails::sendOrderDeliveredWithPoints()` / `EmailHelper::sendOrderDeliveredWithPoints()`.
   - **Business Logic**: Invoked inside `OrderLoyaltyService::awardLoyaltyPointsForOrder()`. Performs atomic claim (`UPDATE orders SET points_awarded = 1 WHERE id = ? AND points_awarded = 0 AND status = 'delivered'`), atomically credits loyalty points to user wallet, and dispatches celebration email with exact points added (`+X UP Points`) and new total wallet balance. For guest checkouts, safely sends delivery confirmation with invitation to create an account.

5. **PostEx Undelivered / Not Received & UP Points Not Assigned Email**:
   - **Trigger**: When PostEx API sends status callback or sync that consignment was returned, cancelled, unreachable, or un-delivered (`returned`, `rtv`, `un-deliver`, `failed`).
   - **Template**: `TransactionalEmails::sendOrderUndelivered()` / `EmailHelper::sendOrderUndelivered()`.
   - **Business Logic**: Restores inventory stock, refunds any redeemed points used at checkout, and dispatches luxury alert email explicitly stating that **UP Points were NOT assigned** because points are only earned on verified deliveries. Highlights refunded checkout points and provides direct Concierge WhatsApp button to rearrange dispatch.

6. **PostEx Webhook Endpoint**:
   - **Routes**: `POST /orders/postex-webhook` and `POST /webhook/postex` in `routes/api.php` registered without session middleware for direct PostEx courier callbacks.
   - **Handler**: `OrderController::postExWebhook()` delegating to `PostExOrderService::handlePostExWebhook()`.
   - **Functionality**: Reads JSON/POST payload (`trackingNumber` or `orderRefNumber`), matches order in database, updates order status & courier status message, and automatically triggers the corresponding business logic and luxury email (Delivered with Points vs. Undelivered with No Points).

7. **Live Verification & 100% Passing Test Suite (`scratch/test_order_lifecycle_flow.php`)**:
   - 21 automated assertions executed via PHP CLI:
     - `Order Placed Successfully`: Title matches, itemized table rendered, shipping summary verified (`Passed`).
     - `Order Confirmed`: Title matches, PostEx tracking number rendered, courier partner verified (`Passed`).
     - `Order Cancelled`: Title matches, redeemed points refund notice verified, dark mode protection verified (`Passed`).
     - `PostEx Delivered`: Atomic DB points credit (+150 UP Points -> 650 balance), celebration card and balance verified (`Passed`).
     - `PostEx Undelivered`: Parcel return card, explicit "UP Points Not Assigned" declaration, redeemed points refund notice verified (`Passed`).
     - `PostEx Webhook Handling`: Real webhook payload simulated; verified atomic status transition to `delivered` and loyalty points claim (`points_awarded = 1`) (`Passed`).

---

## 📊 Summary: Before vs. After Luxury Email Redesign

| Email Architecture Dimension | Legacy State (Before) | Luxury Hardened State (Now) | Status |
| :--- | :--- | :--- | :---: |
| **Checkout Confirmation** | Immediately sent "Order Confirmed" saying order is being processed; caused customer confusion | Separated into **Order Placed Successfully** (pending verification) and **Order Confirmed** (when verified by atelier/admin) | ✅ Complete |
| **Order Acceptance & Dispatch** | Generic status email without courier details | **Order Confirmed** with PostEx tracking number, courier card & atelier progress | ✅ Complete |
| **Order Cancellation** | Minimal notification; no points refund clarity | Dedicated luxury cancellation email confirming redeemed UP points restoration | ✅ Complete |
| **PostEx Delivered Flow** | Generic points notice; no celebration of delivery | **Order Delivered & UP Points Credited** with prominent `+X UP Points` award badge and updated wallet balance | ✅ Complete |
| **PostEx Undelivered / Return** | No specialized communication | **Order Not Received** email explicitly declaring **UP Points Not Assigned** + WhatsApp re-delivery concierge CTA | ✅ Complete |
| **PostEx Webhook Integration** | No webhook callback endpoint existed | `POST /orders/postex-webhook` and `/webhook/postex` for automated courier status processing | ✅ Complete |
| **Email Duplication** | Checkout triggered two separate emails (`NotificationHelper` + `EmailHelper`) | Unified single-email dispatch per event with internal notification suppression (`$sendEmail = false`) | ✅ Complete |
| **Template Engine Architecture** | Two fragmented engines (`EmailTemplates` vs `NotificationEmailTemplate`) | Single unified engine (`LuxuryEmailLayout` + `EmailComponents`) | ✅ Complete |
| **Brand & Store Alignment** | Generic Arial/Georgia fonts with clashing yellow-gold (`#C5A059`) | Haute-couture `Cormorant Garamond` serif, `Inter` body, `#111111` onyx, champagne accents | ✅ Complete |
| **Gmail Dark Mode Inversion** | Headers and buttons inverted to washed-out gray/white | Protected via CSS `linear-gradient(#111111, #111111)` inversion neutralizer | ✅ Complete |
| **Live Visual Inspection Suite** | None (required actual SMTP dispatch to test) | Dedicated interactive preview harness with 12 templates at `http://localhost/backend/email_preview.php` | ✅ Complete |

---

## ⚡ Speed & Latency Hardening Phases

### 🔹 Phase S1: 3.8 MB Base64 Purge & Cloudinary Asset Migration (✅ Completed)
**Objective:** Eliminate severe JSON bloat caused by raw Base64 PNG images embedded inside `site_settings`.

1. **Root Cause Analysis & Discovery**:
   - Initial benchmark of `GET /settings/storefront` revealed an alarming response payload of **4,036,442 bytes (4.03 MB)** and **155.22 ms** execution time.
   - Deep inspection found that `site_settings.megaMenuData` contained three raw Base64 PNG images under `menus[3]['links']` (`All Bras` = 2,111,314 bytes, `Bra Sets` = 1,699,234 bytes, `Bralettes` = 24,639 bytes), alongside `logo` (28,882 bytes) and `favicon` (28,882 bytes).
2. **Safety Backup**:
   - Persisted atomic safety backups in `site_settings` under `_backup_megaMenuData_base64`, `_backup_logo_base64`, and `_backup_favicon_base64`.
3. **Cloudinary Asset Upload & URL Replacement**:
   - Successfully uploaded all 3 MegaMenu images, logo, and favicon to Cloudinary:
     - `All Bras`: `https://res.cloudinary.com/dhlvm5n1q/image/upload/v1790319889/megamenu/bdvspdqpvqjqpclkmoce.png`
     - `Bra Sets`: `https://res.cloudinary.com/dhlvm5n1q/image/upload/v1790319932/megamenu/ihcglstm8zassslvoafz.png`
     - `Bralettes`: `https://res.cloudinary.com/dhlvm5n1q/image/upload/v1790319937/megamenu/mzpj0kmj8aksqwzywwxm.webp`
     - `logo`: `https://res.cloudinary.com/dhlvm5n1q/image/upload/v1790319959/branding/qyvu4eaiew3cyvn2uhot.png`
     - `favicon`: `https://res.cloudinary.com/dhlvm5n1q/image/upload/v1790319961/branding/bb0zugiyxyhrfygltw07.png`
   - Replaced all raw base64 data in `megaMenuData`, `logo`, and `favicon` with the respective CDN URLs.
4. **Permanent Base64 Prevention Shield**:
   - In [`SettingsController.php`](file:///c:/xampp/htdocs/backend/controllers/settings/SettingsController.php), added automated regex interceptors in `update()` and `updateHomepage()` using `CloudinaryHelper::uploadImageBase64()`. If an administrator ever pastes a base64 image in the future, it is automatically extracted, uploaded to Cloudinary, and saved as a CDN URL.
5. **Verified Live Performance Results**:
   - `megaMenuData` raw size: **3,917,156 bytes ➔ 8,850 bytes** (reduced by **3,816 KB / 99.77%**).
   - `/settings/storefront` response payload: **4,036,442 bytes ➔ 69,666 bytes** (**98.27% reduction**).
   - `/settings/storefront` execution latency: **155.22 ms ➔ 8.56 ms** (**18.1x faster**).
   - Mobile 4G transfer time estimated reduction: **~4.5 seconds saved on every visitor's first page load**.

---

### 🔹 Phase S2: Database Connection & Handshake Zero-Latency Optimization (✅ Completed)
**Objective:** Eliminate redundant database handshake queries, leverage persistent socket connections, and memoize verified port configurations.

1. **DSN Handshake UTF-8MB4 Encoding**:
   - In [`config/db.php`](file:///c:/xampp/htdocs/backend/config/db.php):
     - Embedded `;charset=utf8mb4` directly in candidate DSN strings (`mysql:host=...;port=...;dbname=...;charset=utf8mb4`).
     - Completely eliminated the blocking extra SQL roundtrip query `$this->conn->exec("set names utf8");` on every connection. The MySQL PDO driver sets the charset directly in the initial TCP connection handshake packet.
2. **Persistent Connections & Native Prepared Statements**:
   - Added `PDO::ATTR_PERSISTENT => true`: enables PHP workers under Apache/FastCGI to reuse established MySQL connection sockets instead of opening a brand new TCP handshake on every HTTP request.
   - Added `PDO::ATTR_EMULATE_PREPARES => false`: activates true native prepared statements for superior query execution speed and SQL injection defense.
3. **Smart Disk-Cached Verified Port Memoization**:
   - Created `cache/db_resolved_config.json`: when a candidate connection succeeds on the active environment port, the working configuration is persisted to disk. Subsequent requests directly use the verified working config on the very first try with 0ms retry delay.
4. **Verified Live Performance Results (`scratch/test_db_optimization.php` & `scratch/benchmark_backend.php`)**:
   - Legacy DB Connection latency: **2.06 ms average**
   - Optimized DB Connection latency: **0.8 ms average (Min: 0.19 ms)** ➔ **61% latency reduction**.
   - Cumulative endpoint execution times with Phase S1 + S2:
     - `GET /settings/storefront`: **3.09 ms** (from originally **155.22 ms** ➔ **50x faster!**)
     - `GET /categories`: **1.25 ms**
     - `GET /products` (DB fetch): **12.24 ms**
     - `GET /products` (Cached): **2.69 ms**
   - Test suite verification: All 21 order lifecycle assertions passed (100% success).






---

### 🔹 Phase S4: Storefront Payload Partitioning & Pre-Serialized Caching (✅ Completed)
**Objective:** Eliminate CPU serialization bottlenecks on cache hits (JSON decode/encode double-pass) and support lean storefront payload partitioning.

1. **Pre-Serialized Raw JSON Engine in CacheHelper**:
   - In [`helpers/CacheHelper.php`](file:///c:/xampp/htdocs/backend/helpers/CacheHelper.php), engineered zero-copy pre-serialized caching:
     - `CacheHelper::getRaw($key)`: checks L1 memory cache or retrieves the `.rawcache` file from disk using a single-line binary header (`<expires>|<key>\n`). Completely avoids `json_decode`, reading the raw pre-serialized string in sub-millisecond time.
     - `CacheHelper::setRaw($key, $rawJson, $ttl)`: caches the pre-serialized JSON string directly into L1 memory and L2 file without running `json_encode` twice.
     - `CacheHelper::streamRaw($key, array $headers = [])`: checks raw cache and immediately streams the raw string to the HTTP output buffer with proper content headers (`Content-Type: application/json; charset=utf-8` and `Cache-Control`). Returns `true` on cache hit, allowing the controller to return instantly.
     - `CacheHelper::invalidate($prefix = '')`: synchronized to invalidate both `.cache` and `.rawcache` files and L1 memory caches.
2. **Storefront Payload Partitioning**:
   - In [`SettingsController::getStorefront()`](file:///c:/xampp/htdocs/backend/controllers/settings/SettingsController.php):
     - Integrated `CacheHelper::streamRaw('settings_storefront_raw')` for the primary storefront endpoint.
     - Added optional `?partition=core` support: extracts only critical visual UI, branding, navigation, announcement bar, hero data, home toggles, banners, currency, header, and footer (`~30 KB`), omitting secondary CMS and legal texts (`~39 KB`).
     - Maintained 100% backward compatibility: the default request returns all keys expected by `useSiteSettingsStore.js` and checkout policy modals.
3. **Pre-Serialized Streaming Across High-Traffic Endpoints**:
   - In [`CategoryController::index()`](file:///c:/xampp/htdocs/backend/controllers/categories/CategoryController.php): Implemented `CacheHelper::streamRaw('categories_list_raw')`.
   - In [`ProductQueryService.php`](file:///c:/xampp/htdocs/backend/controllers/products/services/ProductQueryService.php):
     - In `index()`: query responses are pre-serialized and streamed directly with `CacheHelper::streamRaw($cacheKey . '_raw')`.
     - In `show($slugOrId)`: single product detail views stream with `CacheHelper::streamRaw($cacheKey . '_raw')`.
     - Guarded all header calls with `if (!headers_sent())` for safe CLI / benchmark / background worker execution.
4. **Verified Live Performance Results (`scratch/benchmark_backend.php`)**:
   - `GET /settings/storefront?partition=core`: **0.48 ms** (Payload: **30.1 KB** ➔ **57% payload reduction** from unpartitioned).
   - `GET /settings/storefront` (Full Pre-Serialized Cache Hit): **2.29 ms** (Payload: **69.3 KB** ➔ streamed with zero JSON decode/encode overhead).
   - `GET /categories` (Pre-Serialized Cache Hit): **0.46 ms** (sub-millisecond latency).
   - `GET /products` (Pre-Serialized Cache Hit): **0.27 ms** (microsecond territory, down from 2.69 ms ➔ **10x faster cache delivery**).
   - Order Lifecycle Test Suite (`scratch/test_order_lifecycle_flow.php`): **21 Passed, 0 Failed (100% Success)**.

---

### 🔹 Phase S3: Product Query & Image Subquery Optimization (✅ Completed)
**Objective:** Eliminate unindexed filesorts on product sorting, reduce image subquery transfer volume by 73%, and optimize single-product lookups to constant indexed speed.

1. **Image Query List-Mode Filtering & Natural Index Order**:
   - In [`ProductQueryService::index()`](file:///c:/xampp/htdocs/backend/controllers/products/services/ProductQueryService.php):
     - In catalog list mode (`!$isFull`), added filter `AND (is_primary = 1 OR color IS NULL OR color = '')`. This omits hundreds of redundant secondary angle shots for non-primary colors that were previously transferred only to be discarded in PHP by `array_slice()`. Database image rows transferred dropped from **2,650 rows to 720 rows (73% reduction)**.
     - Changed ordering from global `ORDER BY is_primary DESC, id ASC` to `ORDER BY product_id, is_primary DESC, id ASC`. This aligns with the clustered and compound indexes, completely eliminating cross-product `Using filesort`.
2. **Single Product Constant Indexed Lookup**:
   - In [`ProductQueryService::show()`](file:///c:/xampp/htdocs/backend/controllers/products/services/ProductQueryService.php):
     - Replaced `WHERE p.slug = ? OR p.id = ?` (which triggered an `index_merge / Using union` scan) with an upfront check: `$whereField = is_numeric($slugOrId) ? "p.id = ?" : "p.slug = ?";`.
     - Converted query plan from `index_merge` to `type: const` on the primary/unique key, dropping lookup latency by **38%** (from 0.83 ms to 0.52 ms).
3. **Database Index Migrations**:
   - In [`migrations/services/IndexMigrations.php`](file:///c:/xampp/htdocs/backend/migrations/services/IndexMigrations.php):
     - Added `idx_products_created_at` on `products(created_at)`: optimizes default catalog sorting (`ORDER BY created_at DESC`), allowing paginated queries (`LIMIT 24`) to execute with zero filesort via direct reverse B-Tree index scan.
     - Added `idx_prod_img_sort` on `product_images(product_id, is_primary, id)`: covers product image grouping and primary-first sorting.
4. **Verified Live Performance Results (`scratch/benchmark_backend.php`)**:
   - Uncached Product Query + Image Fetch: **2.18 ms** (down from **77.6 ms** ➔ **~35x faster uncached**).
   - Pre-Serialized Cached Product Query: **0.61 ms**.
   - Single Product Lookup (`show`): **0.52 ms** (`type: const`).


---

## 🛠️ PART 4: HEADER & FOOTER COLUMNS MISMATCH & CONTACT INFO DB SYNC MASTER PLAN

```mermaid
graph TD
    A[Admin Header & Footer Settings] --> B[Issue 1: Contact Info Not Saving to DB]
    A --> C[Issue 2: Columns & Data Mismatch in Admin vs Live Site]

    B --> B1["SettingsController::update() loop bug: $valStr unassigned for strings/numbers"]
    B --> B2["Dual-Key Storage: contactEmail in site_settings vs footerData.contactEmail in settings_theme"]
    B --> B3["Fix: Strict string typing in SettingsController + synchronize dual keys on save"]

    C --> C1["Admin displays orphaned 'Footer Navigation Columns' (SHOP ALL) not on Desktop"]
    C --> C2["Live Desktop Footer hardcodes 4 fixed columns: Boutiques, Contact Us, Company Info, Get Help"]
    C --> C3["Missing Admin Editor for Column 4 (GET HELP) links"]
    C --> C4["Fix: Realign Admin into 4 1-to-1 Column Editors matching Desktop & Mobile visual layout"]
```

### 📋 Executive Problem Breakdown

#### 🔴 Problem 1: Contact Info (Email, Phone) Not Saving to Database
1. **Root Cause in Backend (`SettingsController.php` lines 243-248)**:
   ```php
   // Existing Bug in SettingsController.php:
   if (is_array($value) || is_object($value)) {
       $valStr = json_encode($value);
   } elseif (is_bool($value)) {
       $valStr = $value ? 'true' : 'false';
       $valStr = (string) $value; // <-- Misplaced inside elseif!
   }
   // Missing 'else' branch: For strings (e.g. contactEmail, contactPhone), $valStr was NEVER assigned!
   // It retained the previous loop iteration's value (e.g. footerData JSON), corrupting or dropping contact values!
   ```
2. **Dual-Key Storage Desynchronization**:
   - Storefront footer (`Footer.jsx` / `FooterContactColumn.jsx`) displays `contactEmail || fd.contactEmail` and `contactPhone || fd.contactPhone`.
   - In `HeaderFooterTab.jsx`, inputs were bound to local state `globalContactEmail` and `globalContactPhone`, but did not keep `fd.contactEmail` and `fd.contactPhone` synchronized inside the `footerData` object.

#### 🔴 Problem 2: Admin Header & Footer Section vs Live Footer Columns Mismatch
1. **Live Footer Layout (Desktop)**:
   - **Column 1**: Brand & Boutique Block (Image, UnderPure Title, Description, Store Locations, Explore Button).
   - **Column 2**: CONTACT US (Hours, Email, Phone, Returns Center link).
   - **Column 3**: COMPANY INFO (Title + Dynamic Links: About Us, Loyalty Program, Take Our Survey).
   - **Column 4**: GET HELP (Title + Links: My Account, Chat with a Stylist, Find Your Bra Size, FAQs, Affiliates, Careers).
2. **Admin Panel Mismatch**:
   - Displays a generic "Footer Navigation Columns" section with `SHOP ALL` (New Arrivals, Lingerie, Best Sellers, Sale). However, `SHOP ALL` is **nowhere to be found on the Desktop footer**; it was only passed to mobile accordions.
   - Admin has a separate "Company Info Column Links" editor, but **zero editor for Column 4 (GET HELP)**.
   - The sections in Admin are disoriented, confusing the administrator who expects to see and edit the 4 columns exactly as they appear left-to-right on the website.

---

### 🚀 Step-by-Step Implementation Plan

#### Step 1: Backend Settings Controller Persistence Fix (`SettingsController.php`)
- **File**: [`controllers/settings/SettingsController.php`](file:///c:/xampp/htdocs/backend/controllers/settings/SettingsController.php)
- **Fix**: Correct the type handler in `update()`:
  ```php
  if (is_array($value) || is_object($value)) {
      $valStr = json_encode($value);
  } elseif (is_bool($value)) {
      $valStr = $value ? 'true' : 'false';
  } else {
      $valStr = (string) $value;
  }
  ```
- **Ensure**: Both `site_settings` and `settings_general` receive the clean string, and `CacheHelper::invalidate('settings')` + `CacheHelper::invalidate('settings_storefront')` flush all cache partitions instantly upon saving.

#### Step 2: 1-to-1 Column Mapping in Admin (`HeaderFooterTab.jsx` & Components)
- **Files**:
  - [`Frontend/src/pages/admin/content-tabs/header-footer/HeaderFooterTab.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/admin/content-tabs/header-footer/HeaderFooterTab.jsx)
  - Create [`GetHelpColumnEditor.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/admin/content-tabs/header-footer/components/GetHelpColumnEditor.jsx)
  - Update [`ContactInfoEditor.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/admin/content-tabs/header-footer/components/ContactInfoEditor.jsx)
  - Update [`CompanyInfoColumnEditor.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/admin/content-tabs/header-footer/components/CompanyInfoColumnEditor.jsx)
  - Remove / Rename confusing orphaned `NavColumnsEditor` or integrate it as optional custom promotional columns.
- **Visual Section Flow in Admin**:
  1. **Header Bar Configuration**:
     - SMS Banner Editor
     - Header Help Dropdown
  2. **Footer Column 1: Boutique & Store Locations**:
     - Visible toggle, Title, Description, Image Upload, CTA Text & Link, Store Locations list.
  3. **Footer Column 2: Contact Us**:
     - Service Hours, Contact Email, Contact Phone, Returns Center Link Text & URL.
  4. **Footer Column 3: Company Info Links**:
     - Column Title (`COMPANY INFO`), Add/Edit/Remove Link item list (`label`, `url`).
  5. **Footer Column 4: Get Help & Customer Service**:
     - Column Title (`GET HELP`), Add/Edit/Remove Link item list (`label`, `url`, default items: My Account, Chat with Stylist toggle, Find Your Bra Size, FAQs, Affiliates, Careers).
  6. **Footer Brand & Legal**:
     - Social Links (Instagram, TikTok, Pinterest, Facebook, YouTube)
     - Big Brand Logo text & toggle
     - Copyright & Legal links (Privacy Policy, Terms of Use)

#### Step 3: Frontend Footer Dynamic Rendering Alignment
- **Files**:
  - [`Frontend/src/components/footer/Footer.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/components/footer/Footer.jsx)
  - [`Frontend/src/components/footer/components/FooterGetHelpColumn.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/components/footer/components/FooterGetHelpColumn.jsx)
  - [`Frontend/src/components/footer/components/FooterMobileAccordions.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/components/footer/components/FooterMobileAccordions.jsx)
- **Enhancement**:
  - Connected `FooterGetHelpColumn` to dynamic `fd.getHelpTitle` and `fd.getHelpLinks` from `footerData` (with graceful fallback to default links, click event dispatching for Chat with Stylist, and auth status detection).
  - Enhanced `FooterContactColumn` to support dynamic `fd.contactTitle`, `fd.contactReturnsText`, and `fd.contactReturnsLink`.
  - Updated `FooterMobileAccordions` to display the exact 4 primary sections in order:
    1. Contact Us
    2. Returns Center
    3. Company Info
    4. Get Help
    5. Additional Dynamic Columns
  - Ensured all changes made in Admin immediately reflect on both Desktop and Mobile footers.

#### Step 4: Verification & Testing (✅ Verified)
- Verified updating Email, Phone, and Service Hours via Admin panel ➔ values persist cleanly into MySQL `site_settings` and `settings_general`.
- Verified editing Column 1 (Boutiques), Column 2 (Contact Us), Column 3 (Company Info), and Column 4 (Get Help) titles and links ➔ instant live reflection on Desktop and Mobile footers.
- Executed `npm run build` ➔ compiled successfully in 19.85s with 0 errors.

---

# 🌐 PART 6: COMPREHENSIVE E-COMMERCE META TAGS & META PLATFORMS INTEGRATION PLAN

## 📌 Objective
Storefront ke har page (Home, Product Detail, Collections/Categories) par industry-standard e-commerce meta tags, Open Graph (OG) tags for WhatsApp/Facebook, Meta Catalog microdata tags, aur Google Rich Snippets (Schema.org JSON-LD) implement karna, aur Meta Platforms (Facebook Business Suite, Instagram Shop Catalog, WhatsApp Previews) ke sath sync karna.

```mermaid
graph TD
    A[E-Commerce Meta Tags & Meta Platforms] --> B[Phase 1: Dynamic SEO Component Upgrade]
    A --> C[Phase 2: Product Detail Page Dynamic Tags]
    A --> D[Phase 3: Collections & Home Page SEO]
    A --> E[Phase 4: Static Base Meta Tags & Favicon Alignment]
    A --> F[Phase 5: Meta Platforms Sync & Verification]

    B --> B1[Open Graph 1200x630 Image Pipeline]
    B --> B2[Meta Catalog Product Microdata Tags]
    B --> B3[Auto Schema.org Product Rich Snippets]

    C --> C1[Dynamic Price, Currency, Stock Status]
    C --> C2[High-Res Primary Product Image Transformation]
    C --> C3[Unique Product Retailer Item IDs]

    D --> D1[Category Title, Banner & Description]
    D --> D2[Organization & WebSite SearchAction Schema]

    E --> E1[index.html Meta Domain Verification]
    E --> E2[Fallback Social Share Image Assets]

    F --> F1[Meta Business Suite Domain Claim]
    F --> F2[Facebook Sharing Debugger Cache Scrape]
    F --> F3[Instagram Shop Catalog Auto-Sync]
    F --> F4[Google Rich Results Test Validation]
```

---

## 🚀 Structured Phases Breakdown

### 🔹 Phase 1: Core Dynamic SEO Component Upgrade (`SEO.jsx`)
* **Files Involved**:
  - [`Frontend/src/components/SEO.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/components/SEO.jsx)
* **Tasks**:
  1. Support extended Open Graph tags:
     - `og:image:width` (1200) & `og:image:height` (630)
     - `og:image:type`, `og:site_name`, `og:locale` (`en_US`)
  2. Implement Meta / Facebook Catalog Product Microdata tags:
     - `product:brand`
     - `product:availability` (`in stock` / `out of stock`)
     - `product:condition` (`new`)
     - `product:price:amount`
     - `product:price:currency` (`PKR`)
     - `product:retailer_item_id`
     - `product:item_group_id`
  3. Integrate automatic Cloudinary image optimization for social share previews (`w_1200,h_630,c_fill,q_auto,f_auto`) so WhatsApp and Facebook cards render instantly in high quality.
  4. Build automatic Schema.org JSON-LD generation for `Product` and `BreadcrumbList`.

---

### 🔹 Phase 2: Product Detail Page Deep Integration (`ProductDetail.jsx`)
* **Files Involved**:
  - [`Frontend/src/pages/ProductDetail.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/ProductDetail.jsx)
* **Tasks**:
  1. Extract active product state: `name`, `price`, `description`, `category`, `stock_count` / `inventory`, `slug`, `id`, and primary image.
  2. Pass structured props to `<SEO />`:
     - Clean meta description without HTML tags.
     - Accurate `product:price:amount` formatted to 2 decimals.
     - Dynamic `product:availability`: checks total inventory / stockCount to emit `in stock` or `out of stock`.
     - Canonical URL pointing strictly to `https://www.underpure.com/product/${slug}`.
  3. Emit Google Merchant compliant Product schema with Price, Currency, Availability, and Brand.

---

### 🔹 Phase 3: Collection & Home Page Structured Data
* **Files Involved**:
  - [`Frontend/src/pages/Collection.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/Collection.jsx)
  - [`Frontend/src/pages/Home.jsx`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/src/pages/Home.jsx)
* **Tasks**:
  1. Collection Pages:
     - Dynamic title: `[Category Name] - Luxury Collection | UnderPure`
     - Category banner or primary collection hero image for `og:image`.
     - Canonical link for each collection slug (`/collections/[slug]`).
  2. Home Page:
     - Store-wide Organization Schema (`@type: "Organization"`), logo, social profiles (Instagram, Facebook, TikTok).
     - WebSite Schema with Google Sitelinks SearchBox target (`/collections/all?search={search_term_string}`).

---

### 🔹 Phase 4: Static Base Meta Tags & Asset Quality (`index.html`)
* **Files Involved**:
  - [`Frontend/index.html`](file:///c:/Users/sb850/OneDrive/Desktop/Underpure%205/Frontend/index.html)
* **Tasks**:
  1. Ensure `facebook-domain-verification` is current and verified.
  2. Set a high-resolution 1200x630 fallback social share banner for general site shares (e.g. `/images/og-underpure-1200x630.jpg`).
  3. Confirm `robots` meta tag: `index, follow, max-image-preview:large`.
  4. Ensure Twitter card metadata (`summary_large_image`) aligns with Open Graph values.

---

### 🔹 Phase 5: Meta Platforms Setup & Verification Runbook
* **Platforms**:
  - **Meta Business Suite**: Domain Verification (`business.facebook.com > Brand Safety > Domains`).
  - **Facebook Sharing Debugger**: Link scraping and preview cache purge (`developers.facebook.com/tools/debug/`).
  - **Meta Commerce Manager**: Syncing dynamic product catalog via Microdata Pixel ingestion.
  - **Google Rich Results Test**: Validating product schema on `search.google.com/test/rich-results`.

---

## 🎯 Verification Criteria
- [ ] Product page shared on WhatsApp shows large product image, title, and brand name.
- [ ] Facebook Sharing Debugger shows 0 errors and parses `og:title`, `og:image`, and `product:price:amount`.
- [ ] Google Rich Results Test passes with valid "Product" structured data and 0 critical errors.
- [ ] `npm run build` passes with 0 syntax or bundling errors.

