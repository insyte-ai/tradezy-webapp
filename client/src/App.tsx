import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import StoresPage from './pages/StoresPage';
import StoreDetailPage from './pages/StoreDetailPage';
import BrandsPage from './pages/BrandsPage';
import BrandDetailPage from './pages/BrandDetailPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import SellerSignupPage from './pages/auth/SellerSignupPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/Products';
import ProductForm from './pages/seller/ProductForm';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

import PrivateRoute from './components/PrivateRoute';
import RoleBasedRedirect from './components/common/RoleBasedRedirect';
import AuthInitializer from './components/auth/AuthInitializer';
import { UserRole } from './types/user';
import BuyerOnboardingFlow from './pages/onboarding/buyer/BuyerOnboardingFlow';
import SellerOnboardingFlow from './pages/onboarding/seller/SellerOnboardingFlow';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Router>
          <Toaster position="top-right" />
          <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route 
              index 
              element={
                <RoleBasedRedirect>
                  <HomePage />
                </RoleBasedRedirect>
              } 
            />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="categories/:slug" element={<CategoryPage />} />
            <Route path="stores" element={<StoresPage />} />
            <Route path="stores/:slug" element={<StoreDetailPage />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="brands/:slug" element={<BrandDetailPage />} />
          </Route>

          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="verify-email" element={<EmailVerificationPage />} />
          </Route>

          <Route path="/seller" element={<AuthLayout />}>
            <Route path="signup" element={<SellerSignupPage />} />
            <Route path="apply" element={<SellerSignupPage />} />
          </Route>

          <Route path="/onboarding">
            <Route path="buyer" element={<BuyerOnboardingFlow />} />
            <Route path="seller" element={<SellerOnboardingFlow />} />
          </Route>

          <Route
            path="/seller/*"
            element={
              <PrivateRoute allowedRoles={[UserRole.SELLER]}>
                <DashboardLayout role="seller" />
              </PrivateRoute>
            }
          >
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
          </Route>

          <Route
            path="/buyer/*"
            element={
              <PrivateRoute allowedRoles={[UserRole.BUYER]}>
                <DashboardLayout role="buyer" />
              </PrivateRoute>
            }
          >
            <Route index element={<BuyerDashboard />} />
          </Route>

          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
                <DashboardLayout role="admin" />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </AuthInitializer>
    </Provider>
  );
};

export default App;