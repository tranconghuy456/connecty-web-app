// MODULES //
import React from "react";

// ASSETS//
import logoTrans from "../assets/images/logo-trans.png";
import "../index.css";

const Loading = ({ className = "" }) => {
  return (
    <div className={`loading__container ${className}`}>
      <img
        className="loading"
        alt="loading logo"
        src={logoTrans}
        height={80}
        width={80}
      />
      <p className="mt-2 text-xl">Loading ...</p>
    </div>
  );
};

export default Loading;
