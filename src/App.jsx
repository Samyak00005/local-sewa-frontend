import { Route, Routes, useLocation } from "react-router-dom";

import BottomNavBar from "./components/common/BottomNavBar";
import ActiveRoleBoundary from "./components/common/ActiveRoleBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ScrollToTop from "./components/common/ScrollToTop";

/* -----  CUSTOMER / MAIN PAGES -----*/

import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/common/HomePage";
import EmergencyServicesPage from "./pages/common/EmergencyServicesPage";
import LegalPage from "./pages/common/LegalPage";
import NotFoundPage from "./pages/common/NotFoundPage";
import SupportPage from "./pages/common/SupportPage";
import AllServicesPage from "./pages/customer/AllServicesPage";
import BookingsPage from "./pages/customer/BookingsPage";
import BookProviderPage from "./pages/customer/BookProviderPage";
import NearbyServicesPage from "./pages/customer/NearbyServicesPage";
import ProfilePage from "./pages/customer/ProfilePage";
import ProviderDetailsPage from "./pages/customer/ProviderDetailsPage";
import ServiceCategoryPage from "./pages/customer/ServiceCategoryPage";
import SavedPage from "./pages/customer/SavedPage";

/* ----- AUTHENTICATION PAGES ----- */

import CustomerLoginPage from "./pages/auth/CustomerLoginPage";
import CustomerRegisterPage from "./pages/auth/CustomerRegisterPage";
import ProviderLoginPage from "./pages/auth/ProviderLoginPage";
import ProviderRegisterPage from "./pages/auth/ProviderRegisterPage";

/* -----   SERVICE PROVIDER PAGES ----- */

import ProviderDashboardPage from "../src/pages/serviceprovider/ProviderDashboardPage";
import ProviderProfilePage from "./components/serviceprovider/ProviderProfilePage";
import ProviderRequestsPage from "./components/serviceprovider/ProviderRequestsPage";
import ProviderReviewsPage from "./components/serviceprovider/ProviderReviewsPage";
import ProviderServicesPage from "./components/serviceprovider/ProviderServicesPage";

function App() {
  const location = useLocation();

  /* ----- CHECK CURRENT ROUTE ----- */

  const isProviderRoute = location.pathname.startsWith("/provider");

  const isAuthRoute = location.pathname.startsWith("/auth");

  const showCustomerBottomNav = !isProviderRoute && !isAuthRoute;

  return (
    <div
      className={`min-h-screen ${showCustomerBottomNav ? "pb-24 md:pb-0" : ""}`}
    >
      <ScrollToTop />

      <ActiveRoleBoundary>
      <Routes>
        {/* ----- AUTHENTICATION ----- */}

        <Route path="/auth" element={<AuthPage />} />

        {/* ----- CUSTOMER LOGIN ----- */}

        <Route path="/auth/customer/login" element={<CustomerLoginPage />} />

        <Route
          path="/auth/customer/register"
          element={<CustomerRegisterPage />}
        />

        {/* ----- PROVIDER  ----- */}

        <Route path="/auth/provider/login" element={<ProviderLoginPage />} />

        <Route
          path="/auth/provider/register"
          element={<ProviderRegisterPage />}
        />

        {/* ----- CUSTOMER / MAIN APP ----- */}

        {/* HOME */}

        <Route path="/" element={<HomePage />} />

        <Route path="/services" element={<AllServicesPage />} />

        <Route path="/services/:category" element={<ServiceCategoryPage />} />

        <Route path="/providers/:providerId" element={<ProviderDetailsPage />} />

        <Route path="/nearby" element={<NearbyServicesPage />} />

        <Route path="/emergency" element={<EmergencyServicesPage />} />

        <Route path="/terms" element={<LegalPage type="terms" />} />

        <Route path="/privacy" element={<LegalPage type="privacy" />} />

        <Route path="/support" element={<SupportPage />} />

        <Route
          path="/book/:providerId"
          element={
            <ProtectedRoute role="CUSTOMER">
              <BookProviderPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute role="CUSTOMER">
              <BookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute role="CUSTOMER">
              <SavedPage />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER PROFILE */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="CUSTOMER">
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ===================================================
            SERVICE PROVIDER PANEL
        =================================================== */}

        {/* PROVIDER DASHBOARD */}

        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute role="PROVIDER">
              <ProviderDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* PROVIDER REQUESTS */}

        <Route
          path="/provider/requests"
          element={
            <ProtectedRoute role="PROVIDER">
              <ProviderRequestsPage />
            </ProtectedRoute>
          }
        />

        {/* PROVIDER SERVICES */}

        <Route
          path="/provider/services"
          element={
            <ProtectedRoute role="PROVIDER">
              <ProviderServicesPage />
            </ProtectedRoute>
          }
        />

        {/* PROVIDER REVIEWS */}

        <Route
          path="/provider/reviews"
          element={
            <ProtectedRoute role="PROVIDER">
              <ProviderReviewsPage />
            </ProtectedRoute>
          }
        />

        {/* PROVIDER BUSINESS PROFILE */}

        <Route
          path="/provider/profile"
          element={
            <ProtectedRoute role="PROVIDER">
              <ProviderProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </ActiveRoleBoundary>

      {/* =====================================================
          CUSTOMER BOTTOM NAVIGATION
      ===================================================== */}

      {showCustomerBottomNav && <BottomNavBar />}
    </div>
  );
}

export default App;
