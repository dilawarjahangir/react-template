import React from "react";
import { useLocation, Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import redirects from "../../routes/redirects";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

const generateBreadcrumbs = (pathname) => {
  const paths = pathname.split("/").filter(Boolean);
  return paths.map((path, index) => {
    const to = "/" + paths.slice(0, index + 1).join("/");
    const isLast = index === paths.length - 1;

    return isLast ? (
      <Typography key={to} variant="body1" sx={{ fontWeight: 600, color: "text.primary" }}>
        {path.charAt(0).toUpperCase() + path.slice(1)}
      </Typography>
    ) : (
      <Link key={to} to={redirects[to] ?? to} style={{ textDecoration: "none" }} color="secondary">
        <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary" }}>{path.charAt(0).toUpperCase() + path.slice(1)}</Typography>
      </Link>
    );
  });
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {breadcrumbs}
    </StyledBreadcrumbs>
  );
}
