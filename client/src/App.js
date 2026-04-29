import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import GuestSignupPrompt from "./components/GuestSignupPrompt";
import MobileTabBar from "./components/MobileTabBar";
import Fotter from "./components/Fotter";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import AdminLayout from "./Admin/AdminLayout";
import AdminOrders from "./Admin/AdminOrders";
import AdminProducts from "./Admin/AdminProducts";
import AdminUsers from "./Admin/AdminUsers";
import AdminGroupAdmins from "./Admin/AdminGroupAdmins";
import AdminVideos from "./Admin/AdminVideos";
import AdminSharePosts from "./Admin/AdminSharePosts";
import AdminDeliveryDistance from "./Admin/AdminDeliveryDistance";
import AdminHomeBanner from "./Admin/AdminHomeBanner";
import Dashboard from "./Admin/Dashboard";
import DiscountHeroAdmin from "./Admin/DiscountHeroAdmin";
import DeliveryLayout from "./Admin/DeliveryLayout";
import DeliveryDistance from "./Admin/DeliveryDistance";
import DeliveryOrders from "./Admin/DeliveryOrders";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import PaymentPage from "./pages/PaymentPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermCondition from "./pages/TermCondition";
import Faq from "./pages/Faq";
import ReturnRefund from "./pages/ReturnRefund";
import ShippingDelivery from "./pages/ShippingDelivery";
import AccountDeletion from "./pages/AccountDeletion";
import UserContentPolicy from "./pages/UserContentPolicy";
import HelpSupport from "./pages/HelpSupport";
import SiteMapPage from "./pages/SiteMapPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import UserProfilePage from "./pages/UserProfilePage";
import OrdersHistoryPage from "./pages/OrdersHistoryPage";
import SharePostDetail from "./pages/SharePostDetail";
import Videos from "./pages/Videos";
import { ordersAPI } from "./services/Api";
import "./App.css";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return isAdmin() ? children : <Navigate to="/" replace />;
};

const DeliveryRoute = ({ children }) => {
  const { isAuthenticated, isDelivery, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return isDelivery() ? children : <Navigate to="/" replace />;
};

function PaymentPageWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, cartItems, total } = location.state || {};
  const { clearCart } = useCart();

  const handlePayment = async (method) => {
    if (!address || !cartItems || !total) {
      navigate("/cart");
      return;
    }
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.newPrice,
          quantity: item.quantity,
          image: item.image || "",
          variant: item.selectedVariant
            ? {
              name: item.selectedVariant.name,
              weight: item.selectedVariant.weight,
              weightUnit: item.selectedVariant.weightUnit,
            }
            : (item.variant ? {
              name: item.variant.name,
              weight: item.variant.weight,
              weightUnit: item.variant.weightUnit,
            } : undefined),
        })),
        totalAmount: total,
        shippingAddress: {
          name: address.name,
          address: address.address,
          addressLine2: address.addressLine2,
          landmark: address.landmark,
          city: address.city,
          state: address.state || "",
          pincode: address.pincode,
          phone: address.phone,
          latitude: address.latitude || null,
          longitude: address.longitude || null,
        },
        paymentInfo: {
          method,
        },
      };
      await ordersAPI.create(orderData);
      await clearCart();
      navigate("/", { state: { orderSuccess: true } });
    } catch (err) {
      // alert removed: Order failed. Try again.
    }
  };

  return <PaymentPage onPayment={handlePayment} />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-layout">
          <ScrollToTop />
          <Header />

          <main className="app-main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="group-admins" element={<AdminGroupAdmins />} />
                <Route path="videos" element={<AdminVideos />} />
                <Route path="share-posts" element={<AdminSharePosts />} />
                <Route path="delivery-distance" element={<AdminDeliveryDistance />} />
                <Route path="home-banners" element={<AdminHomeBanner />} />
                <Route path="discount-hero" element={<DiscountHeroAdmin />} />
              </Route>

              <Route
                path="/delivery"
                element={
                  <DeliveryRoute>
                    <DeliveryLayout />
                  </DeliveryRoute>
                }
              >
                <Route index element={<Navigate to="orders" replace />} />
                <Route path="orders" element={<DeliveryOrders />} />
                <Route path="distance" element={<DeliveryDistance />} />
              </Route>

              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<PaymentPageWrapper />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />


              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders-history"
                element={
                  <PrivateRoute>
                    <OrdersHistoryPage />
                  </PrivateRoute>
                }
              />

              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/termCondition" element={<TermCondition />} />
              <Route path="/terms-and-conditions" element={<TermCondition />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/returnRefund" element={<ReturnRefund />} />
              <Route path="/shipping-delivery" element={<ShippingDelivery />} />
              <Route path="/account-deletion" element={<AccountDeletion />} />
              <Route path="/userContent" element={<UserContentPolicy />} />
              <Route path="/user-content-policy" element={<UserContentPolicy />} />
              <Route path="/help-support" element={<HelpSupport />} />
              <Route path="/sitemap" element={<SiteMapPage />} />
              <Route path="/video" element={<Videos />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/share-posts/:id" element={<SharePostDetail />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <MobileTabBar />
          <Fotter />
          <GuestSignupPrompt />
        </div>
        <ToastContainer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;