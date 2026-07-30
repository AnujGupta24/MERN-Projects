import axiosInstance from "./axios";

const fetchUserDetails = async () => {
  try {
    const res = await axiosInstance.get("/user/me");
    // console.log("fetch user details res", res);

    return res.data;
  } catch (error) {
    console.log("FETCHUSERDETAILS ERROR:", error);
  }
};

export default fetchUserDetails;
