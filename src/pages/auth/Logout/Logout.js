import React, { useEffect } from "react";
import AuthService from "../../../services/AuthService";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/global/Loading";
import ts from "../../../services/ToastService";

const Account = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      const result = await AuthService.logout();
      if (result.success) {
        navigate("/login");
      } else {
        console.error("Logout failed:", result.message);
        ts.error("Logout Failed !!");
        navigate('/');
      }
    };

    performLogout();
  }, [navigate]);

  return <Loading />;
};

export default Account;
