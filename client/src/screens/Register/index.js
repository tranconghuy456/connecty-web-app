// MODULES //
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../styles/Login.module.css";
// COMPONENTS //
import { Input } from "../../components/Form";
import Loading from "../../components/Loading";
import { signUp } from "../../network/helper";
// ASSETS //
import unknownUser from "../../assets/images/user-unknown.png";
import ENV from "../../config";
// import {
//   base64ToArrayBuffer,
//   fileToBase64,
//   fileToBlob,
// } from "../../utils/convert";

const Register = () => {
  const [isLoading, setLoading] = useState(false); // loading
  const [error, setError] = useState({}); // error state
  // const [photo, setPhoto] = useState(unknownUser);
  // validate roles
  // item must have same name with field id
  const roles = yup.object().shape({
    firstname: yup.string().required("First name is required."),
    lastname: yup.string().required("Last name is required."),
    email: yup.string().email().required("Email is required."),
    username: yup.string().required("Username is required."),
    password: yup.string().required("Password is required."),
    confirm: yup
      .string()
      .oneOf([yup.ref("password")], "Password doesn't match."),
    // photo validate
    // photoFile: yup
    //   .mixed()
    //   .required("Photo is required.")
    //   .test(
    //     "FILE_SIZE",
    //     "Photo is required.",
    //     (value) => value[0] && value[0].size >= 1
    //   )
    //   .test(
    //     "FILE_FORMAT",
    //     "Unsupported format",
    //     (value) => value[0] && ENV.IMAGE_SUPPORTED.includes(value[0].type)
    //   )
    //   .test(
    //     "FILE_SIZE",
    //     "Image size is too large.",
    //     (value) => value[0] && value[0].size <= ENV.IMAGE_SIZE
    //   ),
    phone: yup.number().positive(),
    age: yup.number().positive(),
    job: yup.string(),
  });

  // form validate
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roles),
  });

  const navigate = useNavigate();

  // onSubmit handler
  const onSubmit = async (value) => {
    try {
      setLoading(true);
      // conver imageFile to blob
      // const blob = await fileToBlob(value.photoFile[0]);

      // helper: signUp
      let { data, status } = await signUp({ ...value }); // photoFile: blob });

      if (status === 201) {
        // succeed
        toast.success(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        // navigate("/verify");
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
      // verify failed
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
              <div className="grid grid-cols-2 mt-6 space-x-2">
                <div className="mb-2">
                  <Input
                    register={register}
                    placeholder="First name (*)"
                    id="firstname"
                    onError={error}
                  />
                </div>
                <div className="mb-2">
                  <Input
                    register={register}
                    placeholder="Last name (*)"
                    id="lastname"
                    onError={error}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1">
                <div className="mb-2">
                  <Input
                    register={register}
                    placeholder="Username (*)"
                    id="username"
                    onError={error}
                  />
                </div>
                <div className="mb-2">
                  <Input
                    register={register}
                    placeholder="Email (*)"
                    id="email"
                    onError={error}
                  />
                </div>

                <div className="grid grid-cols-2 space-x-2">
                  <div className="mb-2">
                    <Input
                      register={register}
                      placeholder="Password (*)"
                      id="password"
                      type="password"
                      onError={error}
                    />
                  </div>
                  <div className="mb-2">
                    <Input
                      register={register}
                      placeholder="Confirm Password (*)"
                      id="confirm"
                      type="password"
                      onError={error}
                    />
                  </div>
                </div>

                {/* <div className="mb-2">
                  <FileInput
                    register={register}
                    placeholder="PhotoFile"
                    id="photoFile"
                    onError={error}
                    accept="image/*"
                    onChange={async (e) => {
                      try {
                        const imageFile = e.target.files[0];
                        const base64 =
                          imageFile && (await fileToBase64(imageFile));
                        if (base64) setPhoto(base64);
                      } catch (error) {
                        toast.error("Invalid image file.");
                      }
                    }}
                  />
                </div> */}
                <div className="grid grid-cols-3 space-x-2">
                  <div className="mb-2">
                    <Input
                      register={register}
                      placeholder="Phone (optional)"
                      id="phone"
                      type="number"
                      onError={error}
                    />
                  </div>
                  <div className="mb-2">
                    <Input
                      register={register}
                      placeholder="Age (optional)"
                      id="age"
                      onError={error}
                    />
                  </div>
                  <div className="mb-2">
                    <Input
                      register={register}
                      placeholder="Job (optional)"
                      id="job"
                      onError={error}
                    />
                  </div>
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
                  Register
                </button>
              </div>
            </form>
            {/* END FORM */}
            <footer className="text-center mt-4">
              <span className="text-sm">
                Already have an account?{" "}
                <Link className="underline hover:text-slate-300" to="/login">
                  Login now
                </Link>
              </span>
            </footer>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;
