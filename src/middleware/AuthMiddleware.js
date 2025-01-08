import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import AuthService from "../services/AuthService";
import Loading from "../components/global/Loading";

const AuthMiddleware = (WrappedComponent) => {
  const MiddlewareComponent = (props) => {
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const validateAuth = async () => {
        const token = Cookies.get("auth_token");
        const lastAuthCheck = Cookies.get("last_auth_check");
        const currentTime = new Date().getTime();

        if (!token || token === "undefined") {
          window.location.href = "/login"; // Redirect to login
          return;
        }

        if (!lastAuthCheck || currentTime - lastAuthCheck > 30 * 60 * 1000) {
          const authResponse = await AuthService.checkAuth();
          if (!authResponse.authenticated) {
            Cookies.remove("auth_token");
            window.location.href = "/login"; // Redirect to login
            return;
          }

          Cookies.set("last_auth_check", currentTime, { expires: 0.5 / 24 }); // 30 minutes expiry
        }

        setIsValid(true);
        setIsLoading(false);
      };

      validateAuth();
    }, []);

    if (isLoading) {
      return <Loading />;
    }

    return isValid ? <WrappedComponent {...props} /> : null;
  };

  return MiddlewareComponent;
};

export default AuthMiddleware;
