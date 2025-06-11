import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/ERPSlice";
import { isAccessible } from "../utils/accessControl";
import axiosInstance from "../utils/axiosInstance";

export default function AuthGuard({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authenticateUser = async () => {
    try {
      debugger;
      const response = await axiosInstance.get(`/authenticate/user`);
      dispatch(setUserData(response.data));
    //  navigate(`/create-template`);
      // await validateUserAndItsRoute(response.data.userRole);
    } catch (error) {
      console.error("Authentication failed", error);
      navigate("/login"); // redirect to login if auth fails
    }
  };

  const validateUserAndItsRoute = async (userRole) => {
    const accessible = await isAccessible(); // no longer shadowed
    // Do something with 'accessible' and 'userRole' here
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return <>{children}</>; // or a loading UI
}
