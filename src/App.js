import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import NotFoundPage from "./pages/errors/NotFoundPage";
import { SnackbarProvider } from 'notistack';

const AppRouter = () => {
  const generateRoutes = (prefix, routeGroup) => {
    return Object.entries(routeGroup).map(([path, Component]) => (
      <Route key={prefix + path} path={prefix + path} element={<Component />} />
    ));
  };

  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          {routes.map(({ prefix, routes }) =>
            generateRoutes(prefix, routes)
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
};

const App = () => {
  return <AppRouter />;
};

export default App;
