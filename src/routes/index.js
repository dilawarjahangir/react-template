import guest_routes from "./guest";
import auth_routes from "./auth";
import admin_routes from "./admin";
import developer_routes from "./developer";

const routes = [
  {
    prefix: "/admin",
    routes: admin_routes,
  },
  {
    prefix: "/developer",
    routes: developer_routes,
  },
  {
    prefix: "/",
    routes: auth_routes,
  },
  {
    prefix: "/",
    routes: guest_routes,
  },
];

export default routes;
