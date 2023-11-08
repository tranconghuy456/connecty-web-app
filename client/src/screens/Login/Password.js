// MODULES //
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import styles from "../../styles/Login.module.css";
// COMPONENTS //
import { Input } from "../../components/Form";
import Loading from "../../components/Loading";
import { login } from "../../network/helper";
// ASSETS //
import { useAuthStore } from "../../context/useAuthStore";
import { yupResolver } from "@hookform/resolvers/yup";

const Password = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false); // loading
  const [error, setError] = useState({}); // error state
  const { data } = useAuthStore((state) => state.auth); // get prev data

  // validate roles
  // item must have same name with field id
  const roles = yup
    .object({
      password: yup.string().required(),
    })
    .required();

  // form validate
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roles),
  });

  // onSubmit handler
  const onSubmit = async ({ password }) => {
    const { username } = data;
    console.log("checking input: " + username);
    try {
      setLoading(true);
      let { data, status } = await login(username, password);
      if (status === 200) {
        // succeed
        localStorage.setItem("token", data.token); // store token
        toast.success(data.message);
      } else {
        // error
        const { element } = data["data"];
        setError({
          [element]: {
            message: data.message,
          },
        });
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // default loading state
    }
  };

  // error state change
  useEffect(() => {
    setError(errors);
  }, [errors]);

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
              {data.photoURL ? (
                <div className="user-avatar flex justify-center mt-5 ">
                  <img
                    className="rounded-full bg-white/90 h-[96px] w-[96px] drop-shadow-md p-2 border-4 border-teal-800"
                    alt="user avatar"
                    src={data.photoURL}
                  />
                </div>
              ) : (
                <div
                  className="user-avatar flex justify-center mt-5"
                  id="userPhoto"
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
            <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 mt-6">
                <Input
                  register={register}
                  placeholder="Password"
                  type="password"
                  id="password"
                  onError={error}
                />
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
