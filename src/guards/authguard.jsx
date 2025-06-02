import React, { useEffect, useDispatch } from "react";
import axiosInstance from "../utils/axiosInstance";
import { setUserData } from "../redux/ERPSlice";
import { isAccessible } from "../utils/accessControl";

export default function AuthGuard() {
  const dispatch = useDispatch();
  const authenticateUser = async () => {
    const response = await axiosInstance.get(`/authenticate/user`);
    dispatch(setUserData(response.data));
    // await validateUserAndItsRoute(response.data.userRole);
  };

  const validateUserAndItsRoute = async (userRole) => {
    const isAccessible = await isAccessible();
  };
  useEffect(() => {
    authenticateUser();
  }, []);
  return <div></div>;
}
