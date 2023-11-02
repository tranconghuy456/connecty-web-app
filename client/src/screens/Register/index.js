// MODULES //
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import styles from "../../styles/Login.module.css";
// COMPONENTS //
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { useAuthStore } from "../../context/useAuthStore";
import { register } from "../../network/helper";
// ASSETS //
import logoTrans from "../../assets/images/logo-trans.png";
import { convertBase64 } from "../../hooks/useConvert";

const Register = () => {
  const [isLoading, setLoading] = useState(false); // loading
  const [photo, setPhoto] = useState(logoTrans);
  const [error, setError] = useState({
    state: null,
    message: "",
  }); // error state

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth); // use setAuth hook
  // Submit handle
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      photoURL: "",
      job: "",
      phone: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (data) => {
      try {
        setLoading(true);
        //data["photoURL"] = photo;
        const { firstname, lastname, email, password, job, phone } = data;
        let response = await register({
          firstname,
          lastname,
          email,
          password,
          //photoURL,
          job,
          phone,
        });
        if (response.status === 201) {
          // if succeed
          setError({ state: false, message: response.data.message }); // reset error state
          //   navigate("/login");
        } else {
          // if failed
          setError({ state: true, message: response.data.message });
        }
      } catch (error) {
        setError({ state: true });
        //toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (error.state === true) {
      // if error
      toast.error(error.message);
    } else if (error.state === false) {
      toast.success(error.message);
    }
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

              <div className="user-avatar flex justify-center mt-5">
                <img
                  className="rounded-full bg-teal-500/20 h-[86px] w-[86px] p-1 drop-shadow-md border-4 border-teal-800"
                  alt="user avatar"
                  src={photo}
                />
              </div>
            </header>
            {/* END HEADER */}

            {/* FORM */}
            <form
              className="w-100"
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}>
              <div className="grid grid-cols-2 mt-6 space-x-2">
                <Input
                  className="mb-2"
                  labelText=""
                  placeholder="First name"
                  inputType="text"
                  error={error.state}
                  isRequired={true}
                  disabled={isLoading}
                  action={{ ...formik.getFieldProps("firstname") }}
                />

                <Input
                  className="mb-2"
                  labelText=""
                  placeholder="Last name"
                  inputType="text"
                  error={error.state}
                  isRequired={true}
                  disabled={isLoading}
                  action={{ ...formik.getFieldProps("lastname") }}
                />
              </div>

              <div className="grid grid-cols-1">
                <Input
                  className="mb-2"
                  labelText=""
                  placeholder="Email"
                  inputType="email"
                  error={error.state}
                  isRequired={true}
                  disabled={isLoading}
                  action={{ ...formik.getFieldProps("email") }}
                />

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

                <Input
                  className="mb-2 block w-full text-sm text-slate-500"
                  inputClass="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-700 file:text-slate-300 hover:file:text-slate-100"
                  inputType="file"
                  inputID="photoInput"
                  error={error.state}
                  isRequired={false}
                  disabled={isLoading}
                  accept="image/*"
                  action={{
                    ...formik.getFieldProps("photoUrl"),
                    ...(onchange = {
                      onChange: async (e) => {
                        try {
                          const file = e.target.files[0] || null;
                          if (file) {
                            const result = await convertBase64(file);
                            setPhoto(result);
                          }
                        } catch (error) {
                          toast.error("Invalid image file.");
                        }
                      },
                    }),
                  }}
                />
              </div>
              <div className="grid grid-cols-2 mb-2 space-x-2">
                <Input
                  className="mb-2"
                  labelText=""
                  placeholder="Job"
                  inputType="text"
                  error={error.state}
                  isRequired={true}
                  disabled={isLoading}
                  action={{ ...formik.getFieldProps("job") }}
                />

                <Input
                  className="mb-2"
                  labelText=""
                  placeholder="Phone number"
                  inputType="number"
                  error={error.state}
                  isRequired={true}
                  disabled={isLoading}
                  action={{ ...formik.getFieldProps("phone") }}
                />
              </div>

              <div className="w-100">
                {/* <p className="text-sm mb-5 mt-1">
                  Forgot password?{" "}
                  <Link
                    className="underline hover:text-slate-300"
                    to="/recovery">
                    Recover it.
                  </Link>
                </p> */}
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
                Have an account?{" "}
                <Link className="underline hover:text-slate-300" to="/login">
                  Login now.
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
