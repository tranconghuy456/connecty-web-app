import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "remixicon/fonts/remixicon.css";
import Login from "../screens/Login";

const MainRoute = () => {
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
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default MainRoute;
