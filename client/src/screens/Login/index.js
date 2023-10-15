import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import styles from "../../styles/Login.module.css";
import Input from "../../components/Input";
import userAvatar from "../../assets/images/user-unknown.png";
import Loading from "../../components/Loading";

const Login = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    state: false,
    message: "",
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ email }) => {
      console.log(email);
      try {
        throw Error;
        setLoading(true);
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      {isLoading ? <Loading /> : ""}
      {/* <Loading /> */}
      <main id="login__container" className="container mx-auto">
        <div className="flex justify-center items-center h-screen">
          <div className={`${styles.glass}`}>
            {/* HEADER */}
            <header className="">
              <h4 className="text-2xl text-center mb-2 text-slate-200">
                Welcome to <b className="text-teal-300">Connecty</b>
              </h4>
              <p className="text-center text-slate-400">
                Explore More by
                <br />
                connecting with us.
              </p>

              <div className="user-avatar flex justify-center mt-5 ">
                <img
                  className="rounded-full bg-white/90 h-[96px] w-[96px] drop-shadow-md p-2 border-4 border-teal-800"
                  alt="user avatar"
                  src={userAvatar}
                />
              </div>
            </header>
            {/* END HEADER */}

            {/* FORM */}
            <form className="w-100" onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 mt-6">
                <Input
                  className="mb-2"
                  labelText=""
                  placeholder="user@mail.com"
                  inputType="email"
                  error={error.state}
                  isRequired={true}
                  action={{ ...formik.getFieldProps("email") }}
                  disabled={isLoading}
                />
                {error.state ? (
                  <p className="text-red-500">{error.message}</p>
                ) : (
                  ""
                )}
              </div>
              <div className="w-100">
                <p className="text-sm mb-5 mt-1">
                  Forgot password?{" "}
                  <Link
                    className="underline hover:text-slate-300"
                    to="/register">
                    Recover it.
                  </Link>
                </p>
                <button
                  type="submit"
                  className="rounded-3xl bg-teal-700 mx-auto p-2 w-[160px] block mt-4 text-slate-300 hover:bg-teal-800"
                  disabled={isLoading}>
                  Login
                </button>
              </div>
            </form>
            {/* END FORM */}
            <footer className="text-center mt-4">
              <span className="text-sm">
                Don't have a account?{" "}
                <Link className="underline hover:text-slate-300" to="/register">
                  Create one.
                </Link>
              </span>
            </footer>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
