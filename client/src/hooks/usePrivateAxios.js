import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import { useAuthStore } from "../context/useAuthStore";
import { useEffect } from "react";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuthStore((state) => state.auth);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use((config) => {
      if (
        !config.headers["authorization"] ||
        !config.headers["x-access-token"]
      ) {
        config.headers["authorization"] = config.headers[
          "x-access-token"
        ] = `Bearer ${auth.accessToken}`;
      }
    });

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response.status === 403 || !prevRequest.sent) {
          prevRequest.sent = true;

          const newAccessToken = await refresh();
          prevRequest.headers["authorization"] = prevRequest.headers[
            "x-access-token"
          ] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return useAxiosPrivate;
};
