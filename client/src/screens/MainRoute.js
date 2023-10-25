import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "remixicon/fonts/remixicon.css";
import Email from "../screens/Login/Email";
import Protected from "../components/Protected";

const MainRoute = () => {
  const isAuth = false;
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
        <Route path="/" element={<Protected isAuth={isAuth}></Protected>} />
        <Route path="/login" element={<Email />} />
      </Routes>
    </>
  );
};

export default MainRoute;
