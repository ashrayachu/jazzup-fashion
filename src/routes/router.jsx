import React from "react";
import { createBrowserRouter } from "react-router-dom";
// import AdminLayout from "../layouts/AdminLayout";
import AdminLayout from "../components/common/layouts/AdminLayout";
import UserLayout from "../components/common/layouts/UserLayout";

// import UserLayout from "../layouts/UserLayout";
import ProtectedRoute from "../routes/ProtectedRoute";

import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Bookings from "../pages/admin/Bookings";

import Home from "../pages/user/Home";
import ProductDetail from "../pages/user/ProductDetail";
import MyBookings from "../pages/user/MyBookings";
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
      { path: "/admin/dashboard", element: <Dashboard /> },
      { path: "/admin/product-list", element: <Products /> },
      { path: "/admin/bookings", element: <Bookings /> },
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
      { path: "/", element: <Home /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/my-bookings", element: <MyBookings /> },
    ],
  },
]);
