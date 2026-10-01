import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazyWithRetry } from "../utils/lazyWithRetry";
import ErrorBoundary from "../components/ErrorBoundary";

// Customer Pages
import Home from "../pages/Home";
const Collection = lazyWithRetry(() => import("../pages/collection/Collection"));
const ProductDetail = lazyWithRetry(() => import("../pages/product-detail/ProductDetail"));
const Checkout = lazyWithRetry(() => import("../pages/checkout/Checkout"));
const AuthPage = lazyWithRetry(() => import("../pages/auth/AuthPage"));
const AboutUs = lazyWithRetry(() => import("../pages/AboutUs"));
const FAQs = lazyWithRetry(() => import("../pages/FAQs"));
const LoyaltyProgram = lazyWithRetry(() => import("../pages/LoyaltyProgram"));
const SizeGuide = lazyWithRetry(() => import("../pages/SizeGuide"));
const ContactUs = lazyWithRetry(() => import("../pages/ContactUs"));
const CustomPage = lazyWithRetry(() => import("../pages/CustomPage"));
const Account = lazyWithRetry(() => import("../pages/account/Account"));
const Cart = lazyWithRetry(() => import("../pages/cart/Cart"));
const NotFound = lazyWithRetry(() => import("../pages/NotFound"));
const Returns = lazyWithRetry(() => import("../pages/Returns"));
const LovelistPage = lazyWithRetry(() => import("../pages/lovelist/LovelistPage"));
const DoNotSell = lazyWithRetry(() => import("../pages/DoNotSell"));
const CustomerDataRequests = lazyWithRetry(() =>
  import("../pages/CustomerDataRequests")
);
const Affiliates = lazyWithRetry(() => import("../pages/Affiliates"));
const TermsOfService = lazyWithRetry(() => import("../pages/TermsOfService"));
const PrivacyPolicy = lazyWithRetry(() => import("../pages/PrivacyPolicy"));
const CookieDeclaration = lazyWithRetry(() =>
  import("../pages/CookieDeclaration")
);
const Careers = lazyWithRetry(() => import("../pages/Careers"));
const FindYourBraSize = lazyWithRetry(() =>
  import("../pages/find-bra-size/FindYourBraSize")
);
const Survey = lazyWithRetry(() => import("../pages/Survey"));

// Admin Pages
const AdminLayout = lazyWithRetry(() =>
  import("../pages/admin/layout/AdminLayout")
);
const AdminDashboard = lazyWithRetry(() =>
  import("../pages/admin/AdminDashboard")
);
const AdminProducts = lazyWithRetry(() =>
  import("../pages/admin/products/AdminProducts")
);
const AdminCategories = lazyWithRetry(() =>
  import("../pages/admin/categories/AdminCategories")
);
const AdminBadges = lazyWithRetry(() =>
  import("../pages/admin/badges/AdminBadges")
);
const AdminContent = lazyWithRetry(() =>
  import("../pages/admin/content/AdminContent")
);
const AdminPromotions = lazyWithRetry(() =>
  import("../pages/admin/promotions/AdminPromotions")
);
const AdminOrders = lazyWithRetry(() =>
  import("../pages/admin/orders/AdminOrders")
);
const AdminCustomers = lazyWithRetry(() =>
  import("../pages/admin/customers/AdminCustomers")
);
const AdminReviews = lazyWithRetry(() =>
  import("../pages/admin/reviews/AdminReviews")
);
const AdminSettings = lazyWithRetry(() =>
  import("../pages/admin/settings/AdminSettings")
);
const AdminReturns = lazyWithRetry(() =>
  import("../pages/admin/returns/AdminReturns")
);
const AdminSurveys = lazyWithRetry(() =>
  import("../pages/admin/surveys/AdminSurveys")
);

export default function AppRoutes({
  cartItems,
  removeFromCart,
  updateQuantity,
  addToCart,
  clearCart,
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center font-serif text-sm tracking-widest text-gray-400">
          LOADING...
        </div>
      }
    >
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/home.html" element={<Navigate to="/" replace />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="/index.php" element={<Navigate to="/" replace />} />
          <Route
            path="/collections/*"
            element={<Collection addToCart={addToCart} />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetail addToCart={addToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            }
          />
          <Route
            path="/checkout"
            element={<Checkout cartItems={cartItems} clearCart={clearCart} />}
          />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/loyalty-program" element={<LoyaltyProgram />} />
          <Route
            path="/lovelist"
            element={<LovelistPage addToCart={addToCart} />}
          />
          <Route path="/account" element={<Account />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/do-not-sell" element={<DoNotSell />} />
          <Route
            path="/data-requests"
            element={<CustomerDataRequests />}
          />
          <Route path="/affiliates" element={<Affiliates />} />
          <Route path="/bra-size" element={<FindYourBraSize />} />
          <Route
            path="/cookie-declaration"
            element={<CookieDeclaration />}
          />
          <Route path="/careers" element={<Careers />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/pages/:pageSlug" element={<CustomPage />} />
          <Route path="*" element={<NotFound />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="badges" element={<AdminBadges />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="returns" element={<AdminReturns />} />
            <Route path="surveys" element={<AdminSurveys />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Suspense>
  );
}
