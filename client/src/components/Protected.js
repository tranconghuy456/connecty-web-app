import React from "react";
import { Navigate } from "react-router-dom";

export default function Protected({ isAuth, children }) {
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
}
