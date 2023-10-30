// MODULES //
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import styles from "../../styles/Login.module.css";
// COMPONENTS //
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { login } from "../../network/helper";
// ASSETS //
import { useAuthStore } from "../../context/useAuthStore";

const Password = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false); // loading
  const [error, setError] = useState({
    state: false,
    message: "",
  }); // error state
  const {
    user: { data },
  } = useAuthStore((state) => state.auth); // get prev data

  // Submit handle
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ password }) => {
      try {
        setLoading(true);
        let response = await login(data.email, password);
        if (response.status === 200) {
          // if succeed
          setError({ state: false, message: "" }); // reset error state
          localStorage.setItem("token", response.data.token); // save token to local storage
          toast.success(response.data.message);
        } else if (response.status === 404) {
          // if not found
          // show alert
          window.alert("Unable to authenticate. Please try again :(.");
          navigate("/login"); // navigate to /login
        } else {
          setError({ state: true, message: response.data.message });
        }
      } catch (error) {
        setError({ state: true });
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
                Welcome back <b className="text-teal-300">{data.firstname}</b>
              </h4>
              <p className="text-center text-slate-400">
                Explore More by
                <br />
                connecting with us.
              </p>
              {data.avatar ? (
                <div className="user-avatar flex justify-center mt-5 ">
                  <img
                    className="rounded-full bg-white/90 h-[96px] w-[96px] drop-shadow-md p-2 border-4 border-teal-800"
                    alt="user avatar"
                    src={data.avatar}
                  />
                </div>
              ) : (
                <div
                  className="user-avatar flex justify-center mt-5"
                  id="userAvatar"
                  data-letters={`
                  ${data.firstname.charAt(0)}${data.lastname.charAt(0)}
                `}></div>
              )}
              {/* <div className="user-avatar flex justify-center mt-5 ">
                <img
                  className="rounded-full bg-white/90 h-[96px] w-[96px] drop-shadow-md p-2 border-4 border-teal-800"
                  alt="user avatar"
                  src={avatar}
                />
              </div> */}
            </header>
            {/* END HEADER */}

            {/* FORM */}
            <form
              className="w-100"
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}>
              <div className="grid grid-cols-1 mt-6">
                <Input
                  className="mb-2"
                  labelText=""
                  placeholder="Password"
                  inputType="password"
                  error={error.state}
                  isRequired={true}
                  disabled={isLoading}
                  action={{ ...formik.getFieldProps("password") }}
                />
                {error.state ? (
                  <span className="text-red-500">
                    <i className="ri-error-warning-line ri-lg mr-1 h-100"></i>
                    {error.message}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="w-100">
                <p className="text-sm mb-5 mt-1">
                  Forgot password?{" "}
                  <Link
                    className="underline hover:text-slate-300"
                    to="/recovery">
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

export default Password;
