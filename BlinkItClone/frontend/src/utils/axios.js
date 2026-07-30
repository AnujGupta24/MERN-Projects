import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const message = error?.response?.data?.message || "Something went wrong";

    if (message) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
