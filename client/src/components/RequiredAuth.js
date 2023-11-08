// MODULES //
import React from "react";
import useAuth from "../hooks/useAuth";
import { Outlet, useLocation } from "react-router-dom";

export default function ReqiredAuth({ allowedRoles }) {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.roles.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Outlet to="/login" state={{ from: location }} replace />
  );
}
