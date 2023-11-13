import axios from "../api/axios";
import { useAuthStore } from "../context/useAuthStore";

const useRefreshToken = () => {
  const { setAuth } = useAuthStore((state) => state.setAuth);

  const refresh = async () => {
    let response = await axios.get("/api/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      console.log(prev);
      console.log(response);
      return { ...prev, response };
    });
    return response;
  };
  return refresh;
};

export default useRefreshToken;
