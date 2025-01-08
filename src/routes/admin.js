import Dashboard from "../pages/admin/Dashboard/Dashboard";
import CustomersManagement from "../pages/admin/CustomersManagement/CustomersManagement";
import Account from "../pages/admin/Account/Account";
import DevicesManagement from "../pages/admin/DevicesManagement/DevicesManagement";
import AssistantsManagement from "../pages/admin/AssistantsManagement/AssistantsManagement";
import DevelopersManagement from "../pages/admin/DevelopersManagement/DevelopersManagement";

import AuthMiddleware from "../middleware/AuthMiddleware";

const admin_routes = {
  "/dashboard": AuthMiddleware(Dashboard),
  "/customers": AuthMiddleware(CustomersManagement),
  "/account": AuthMiddleware(Account),
  "/devices": AuthMiddleware(DevicesManagement),
  "/assistants": AuthMiddleware(AssistantsManagement),
  "/developers": AuthMiddleware(DevelopersManagement),
};

export default admin_routes;
