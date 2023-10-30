import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "remixicon/fonts/remixicon.css";
import Email from "../screens/Login/Email";
import Password from "../screens/Login/Password";
import Protected from "../components/Protected";
import { useAuthStore } from "../context/useAuthStore";

const MainRoute = () => {
  const user = useAuthStore((state) => state.auth);
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Protected isAuth={user}></Protected>} />
        <Route path="/login" element={<Email />} />
        <Route
          path="/verify"
          element={
            <Protected isAuth={user}>
              <Password />
            </Protected>
          }
        />
      </Routes>
    </>
  );
};

export default MainRoute;
