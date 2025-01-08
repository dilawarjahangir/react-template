import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { alpha, styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import AppTheme from "../themes/AppTheme/AppTheme";

import DeveloperSideMenu from './components/DeveloperSideMenu/DeveloperSideMenu';
import DeveloperNavbar from './components/DeveloperNavbar/DeveloperNavbar';
import DeveloperHeader from './components/DeveloperHeader/DeveloperHeader';
import { Container } from "@mui/material";

const MainContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
}));

export default function DeveloperLayout({ children, ...rest }) {
  return (
    <AppTheme {...rest}>
      <CssBaseline />
      <MainContainer>
        
      <Box sx={{ display: 'flex' }}>
        <DeveloperSideMenu />
        <DeveloperNavbar />


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
            <DeveloperHeader />
            <Container maxWidth={false} sx={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
              <div className="HTask-Responsive-Container" style={{ width: 'calc(100vw - 360px)' }}>
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
