import Dashboard from "../pages/developer/Dashboard/Dashboard";
import Account from "../pages/developer/Account/Account";
import AssistantsManagement from "../pages/developer/AssistantsManagement/AssistantsManagement";

import AuthMiddleware from "../middleware/AuthMiddleware";

const developer_routes = {
  "/dashboard": AuthMiddleware(Dashboard),
  "/account": AuthMiddleware(Account),
  "/assistants": AuthMiddleware(AssistantsManagement),
};

export default developer_routes;
