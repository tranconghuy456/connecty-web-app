import axios from "../api/axios";
import { useAuthStore } from "../context/useAuthStore";

const useRefreshToken = () => {
  const { setAuth } = useAuthStore((state) => state.setAuth);

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
