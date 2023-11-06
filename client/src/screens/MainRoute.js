import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "remixicon/fonts/remixicon.css";
import Username from "../screens/Login/Username";
import Password from "../screens/Login/Password";
import Protected from "../components/Protected";
import { useAuthStore } from "../context/useAuthStore";
import Register from "./Register";

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
        <Route path="/login" element={<Username />} />
        <Route
          path="/verify"
          element={
            <Protected isAuth={user}>
              <Password />
            </Protected>
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default MainRoute;
