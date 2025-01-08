import React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import AppTheme from "../themes/AppTheme/AppTheme";

export default function AuthLayout({ children, ...rest }) {
  return (
    <AppTheme {...rest}>
        <CssBaseline enableColorScheme />
        {children}
    </AppTheme>
  );
}
