import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import AppTheme from '../themes/AppTheme/AppTheme';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';

export default function GuestLayout({children, ...rest}) {
  return (
    <AppTheme {...rest}>
        <CssBaseline enableColorScheme />
        <Header />
        {children}
        <Footer />
    </AppTheme>
  );
}