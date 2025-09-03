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
import BrandsPage from './pages/BrandsPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import SellerDashboard from './pages/seller/SellerDashboard';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

import PrivateRoute from './components/PrivateRoute';
import { UserRole } from './types/user';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="brands/:id" element={<BrandsPage />} />
          </Route>

          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
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
    </Provider>
  );
};

export default App;