import React from "react";
import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../components/common/layouts/AdminLayout";
import UserLayout from "../components/common/layouts/UserLayout";
import AddProductPage from "../pages/admin/products/AddProductPage";


import ProtectedRoute from "../routes/ProtectedRoute";
// Admin Pages
import DashboardPage from "../pages/admin/DashboardPage";
import ProductsListPage from "../pages/admin/products/ProductsListPage";
import BookingsListPage from "../pages/admin/BookingsListPage";
// User Pages
import HomePage from "../pages/user/HomePage";
import ProductDetailPage from "../pages/user/ProductDetailPage";
import MyBookingsPage from "../pages/user/MyBookingsPage";

//common pages
import Login from "../pages/Login";
import Unauthorized from "../pages/Unauthorized";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/admin/dashboard", element: <DashboardPage /> },
      { path: "/admin/product-list", element: <ProductsListPage /> },
      { path: "/admin/product-create", element: <AddProductPage /> },
      { path: "/admin/bookings", element: <BookingsListPage /> },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute role="user">
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/product/:id", element: <ProductDetailPage /> },
      { path: "/my-bookings", element: <MyBookingsPage /> },
    ],
  },
]);
