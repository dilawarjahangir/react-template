import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { alpha, styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import AppTheme from "../themes/AppTheme/AppTheme";

import AdminSideMenu from './components/AdminSideMenu/AdminSideMenu';
import AdminNavbar from './components/AdminNavbar/AdminNavbar';
import AdminHeader from './components/AdminHeader/AdminHeader';
import { Container } from "@mui/material";

import './HTask-Responsive-Container.css';

const MainContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
}));

export default function AdminLayout({ children, ...rest }) {
  return (
    <AppTheme {...rest}>
      <CssBaseline />
      <MainContainer>
        
      <Box sx={{ display: 'flex' }}>
        <AdminSideMenu />
        <AdminNavbar />


      <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <AdminHeader />
            <Container maxWidth={false} sx={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
              <div className="HTask-Responsive-Container">
                {children}
              </div>
            </Container>
          </Stack>
        </Box>
      </Box>
      </MainContainer>
    </AppTheme>
  );
}
