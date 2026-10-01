import React, { Suspense, lazy } from 'react';
import TabSkeleton from './TabSkeleton';

const HomeTab = lazy(() => import('../../content-tabs/HomeTab'));
const CollectionTab = lazy(() => import('../../content-tabs/CollectionTab'));
const ProductDetailTab = lazy(() => import('../../content-tabs/ProductDetailTab'));
const CartTab = lazy(() => import('../../content-tabs/CartTab'));
const CheckoutTab = lazy(() => import('../../content-tabs/CheckoutTab'));
const HeaderFooterTab = lazy(() => import('../../content-tabs/HeaderFooterTab'));
const MegaMenuTab = lazy(() => import('../../content-tabs/MegaMenuTab'));
const AboutUsTab = lazy(() => import('../../content-tabs/AboutUsTab'));
const LoyaltyTab = lazy(() => import('../../content-tabs/LoyaltyTab'));
const FaqsTab = lazy(() => import('../../content-tabs/FaqsTab'));
const AuthTab = lazy(() => import('../../content-tabs/AuthTab'));
const AnnouncementTab = lazy(() => import('../../content-tabs/AnnouncementTab'));
const CustomPagesTab = lazy(() => import('../../content-tabs/CustomPagesTab'));
const AccountTab = lazy(() => import('../../content-tabs/AccountTab'));
const LovelistTab = lazy(() => import('../../content-tabs/LovelistTab'));
const PopupTab = lazy(() => import('../../content-tabs/PopupTab'));
const SizeGuideTab = lazy(() => import('../../content-tabs/SizeGuideTab'));
const ContactUsTab = lazy(() => import('../../content-tabs/ContactUsTab'));
const ReturnsTab = lazy(() => import('../../content-tabs/ReturnsTab'));
const ChatWidgetTab = lazy(() => import('../../content-tabs/ChatWidgetTab'));
const DoNotSellDataTab = lazy(() => import('../../content-tabs/DoNotSellDataTab'));
const CustomerDataTab = lazy(() => import('../../content-tabs/CustomerDataTab'));
const AffiliatesTab = lazy(() => import('../../content-tabs/AffiliatesTab'));
const TermsOfServiceTab = lazy(() => import('../../content-tabs/TermsOfServiceTab'));
const PrivacyPolicyTab = lazy(() => import('../../content-tabs/PrivacyPolicyTab'));
const CookieDeclarationTab = lazy(() => import('../../content-tabs/CookieDeclarationTab'));
const CareersTab = lazy(() => import('../../content-tabs/CareersTab'));
const FindBraSizeTab = lazy(() => import('../../content-tabs/FindBraSizeTab'));

export default function AdminContentTabRenderer({ activeTab }) {
  return (
    <div className="pt-2">
      <Suspense fallback={<TabSkeleton />}>
        {activeTab === 'homepage' && <HomeTab />}
        {activeTab === 'collection' && <CollectionTab />}
        {activeTab === 'product-detail' && <ProductDetailTab />}
        {activeTab === 'cart' && <CartTab />}
        {activeTab === 'checkout' && <CheckoutTab />}
        {activeTab === 'header-footer' && <HeaderFooterTab />}
        {activeTab === 'mega-menu' && <MegaMenuTab />}
        {activeTab === 'about-us' && <AboutUsTab />}
        {activeTab === 'chat-widget' && <ChatWidgetTab />}
        {activeTab === 'contact-us' && <ContactUsTab />}
        {activeTab === 'loyalty' && <LoyaltyTab />}
        {activeTab === 'faqs' && <FaqsTab />}
        {activeTab === 'returns' && <ReturnsTab />}
        {activeTab === 'auth' && <AuthTab />}
        {activeTab === 'account' && <AccountTab />}
        {activeTab === 'lovelist' && <LovelistTab />}
        {activeTab === 'announcement' && <AnnouncementTab />}
        {activeTab === 'popup' && <PopupTab />}
        {activeTab === 'size-guide' && <SizeGuideTab />}
        {activeTab === 'custom-pages' && <CustomPagesTab />}
        {activeTab === 'do-not-sell' && <DoNotSellDataTab />}
        {activeTab === 'customer-data' && <CustomerDataTab />}
        {activeTab === 'affiliates' && <AffiliatesTab />}
        {activeTab === 'terms' && <TermsOfServiceTab />}
        {activeTab === 'privacy' && <PrivacyPolicyTab />}
        {activeTab === 'cookie-declaration' && <CookieDeclarationTab />}
        {activeTab === 'careers' && <CareersTab />}
        {activeTab === 'bra-size' && <FindBraSizeTab />}
      </Suspense>
    </div>
  );
}
