import Cookies from "js-cookie";
import apiService from "./apiService";

const api = apiService();

class AuthService {

  static role_redirects = {
    'admin': '/admin/dashboard',
    'customer': '/account/profile',
    'developer': '/developer/dashboard',
  }

  static async login(email, password) {
    try {
      const response = await api.post("/api/login", { email, password });
      if (response.data.success) {
        const { auth_token, user } = response.data;
        Cookies.set("auth_token", auth_token, { path: "/", expires: 7 });
        Cookies.set("user_name", user.name, { path: "/", expires: 7 });
        Cookies.set("user_role", user.role, { path: "/", expires: 7 });
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("[AuthService]: Error during login:", error);
      return { success: false, message: "Login failed" };
    }
  }

  static async logout() {
    try {
      const response = await api.post("/api/logout");
      if (response.data.success) {
        Cookies.remove("auth_token");
        Cookies.remove("user_name");
        Cookies.remove("user_role");
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("[AuthService]: Error during logout:", error);
      return { success: false, message: "Logout failed" };
    }
  }

  static async checkAuth() {
    try {
      const response = await api.get("/api/auth-check");
      return { authenticated: response.data.success };
    } catch (error) {
      console.error("[AuthService]: Error during authentication check:", error);
      return { authenticated: false };
    }
  }

  static getToken() {
    return Cookies.get("auth_token");
  }

  static isLoggedIn() {
    const token = Cookies.get("auth_token");
    return !!token;
  }

  static getUserName() {
    return Cookies.get("user_name") || null;
  }

  static getUserRole() {
    return Cookies.get("user_role") || null;
  }

  static getRedirect(){
    const role = AuthService.getUserRole();
    if(role == null)
      return '/login';

    return AuthService.role_redirects[role];
  }
}

export default AuthService;
