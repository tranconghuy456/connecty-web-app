// MODULES //
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../styles/Login.module.css";
import { Input } from "../../components/Form";
import Loading from "../../components/Loading";
import { useAuthStore } from "../../context/useAuthStore";
import unknownUser from "../../assets/images/user-unknown.png";
import { verifyUserByUsername } from "../../helpers/helper";

const Username = () => {
  const [isLoading, setLoading] = useState(false); // loading
  const [error, setError] = useState([]); // error state
  console.log(error);
  // validate roles
  // item must have same name with field id
  const roles = yup
    .object({
      Username: yup.string().required(),
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
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth); // use setAuth hook

  // onSubmit handler
  const onSubmit = async ({ Username }) => {
    try {
      setLoading(true);
      let response = await verifyUserByUsername(Username);

      if (response.status === 200) return navigate("/verify");
      setError(response.errors);
    } catch (e) {
      // verify failed
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // default loading state
    }
  };

  // error state change
  useEffect(() => {
    setError(error);
  }, [error]);

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
                  src={unknownUser}
                />
              </div>
            </header>
            {/* END HEADER */}

            {/* FORM */}
            <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 mt-6">
                <div className="mb-2">
                  <Input
                    register={register}
                    placeholder="Username"
                    id="Username"
                    onError={error}
                  />
                </div>
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
                  Verify
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

export default Username;
