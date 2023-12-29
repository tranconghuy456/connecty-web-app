// MODULES //
import React from "react";
import useAuth from "../hooks/useAuth";
import { Outlet, useLocation, Navigate } from "react-router-dom";

export default function ReqiredAuth({ allowedRoles }) {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.roles.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
