// MODULES //
import React from "react";
import { Navigate } from "react-router-dom";
import { isObjectEmpty } from "../utils/checker";

export default function Protected({ isAuth, children }) {
  if (isObjectEmpty(isAuth)) return <Navigate to="/login" replace />;
  return children;
}
