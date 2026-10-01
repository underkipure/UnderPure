<?php
// Set Content-Type to XML and prevent browser/client caching of feed
header("Content-Type: application/xml; charset=UTF-8");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// Enable error logging but suppress display to keep XML clean
ini_set('display_errors', 0);
error_reporting(E_ALL);

try {
    require_once __DIR__ . "/config/db.php";

    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        throw new Exception("Database connection failed");
    }

    // Fetch all products
    $sql = "SELECT p.id, p.slug, p.name, p.description, p.price, p.original_price, p.stock_count, c.label as category
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch all product images
    $imgSql = "SELECT product_id, image_url, is_primary FROM product_images ORDER BY is_primary DESC, id ASC";
    $imgStmt = $pdo->prepare($imgSql);
    $imgStmt->execute();
    $allImages = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

    // Group images by product ID
    $imagesByProduct = [];
    foreach ($allImages as $img) {
        $imagesByProduct[$img['product_id']][] = $img['image_url'];
    }

    // Start XML output
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    ?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Underpure Catalog Feed</title>
    <link>https://underpure.com</link>
    <description>Premium Luxury Clothing &amp; Designer Apparel</description>
    <?php foreach ($products as $product): 
        $productId = $product['id'];
        $productImages = $imagesByProduct[$productId] ?? [];
        
        // Resolve primary and additional images
        $primaryImage = 'https://underpure.com/logo.png';
        $additionalImages = [];
        
        if (!empty($productImages)) {
            $primaryImage = $productImages[0];
            $additionalImages = array_slice($productImages, 1, 10); // Meta supports up to 10 additional images
        }
        
        // Ensure image URL is absolute
        if (strpos($primaryImage, 'http') !== 0) {
            $primaryImage = 'https://underpure.com/' . ltrim($primaryImage, '/');
        }

        // Format prices
        $price = number_format($product['price'], 2) . ' PKR';
        $salePrice = null;
        $originalPrice = null;

        if (!empty($product['original_price']) && $product['original_price'] > $product['price']) {
            $originalPrice = number_format($product['original_price'], 2) . ' PKR';
            $salePrice = $price;
        } else {
            $originalPrice = $price;
        }
        
        // Availability
        $availability = ($product['stock_count'] === null || $product['stock_count'] > 0) ? 'in stock' : 'out of stock';
        
        // Category fallback
        $category = !empty($product['category']) ? $product['category'] : 'Clothing';
        
        // Product URLs
        $link = 'https://underpure.com/product/' . $product['slug'];
    ?>
    <item>
      <g:id><?php echo htmlspecialchars($product['slug'] ?: $product['id']); ?></g:id>
      <g:title><![CDATA[<?php echo $product['name']; ?>]]></g:title>
      <g:description><![CDATA[<?php echo !empty($product['description']) ? $product['description'] : $product['name']; ?>]]></g:description>
      <g:link><?php echo htmlspecialchars($link); ?></g:link>
      <g:image_link><?php echo htmlspecialchars($primaryImage); ?></g:image_link>
      <?php foreach ($additionalImages as $addImg): 
          if (strpos($addImg, 'http') !== 0) {
              $addImg = 'https://underpure.com/' . ltrim($addImg, '/');
          }
      ?>
      <g:additional_image_link><?php echo htmlspecialchars($addImg); ?></g:additional_image_link>
      <?php endforeach; ?>
      <g:availability><?php echo $availability; ?></g:availability>
      <g:price><?php echo $originalPrice; ?></g:price>
      <?php if ($salePrice !== null): ?>
      <g:sale_price><?php echo $salePrice; ?></g:sale_price>
      <?php endif; ?>
      <g:brand>Underpure</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>166</g:google_product_category>
    </item>
    <?php endforeach; ?>
  </channel>
</rss>
    <?php
} catch (Exception $e) {
    // Return XML formatted error if anything goes wrong
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    ?>
<rss version="2.0">
  <channel>
    <title>Underpure Catalog Feed Error</title>
    <description><![CDATA[Error: <?php echo $e->getMessage(); ?>]]></description>
  </channel>
</rss>
    <?php
}
