'use client';

import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

// Load the Roboto font from Google via Next.js
// This prevents layout shift and is the standard for MUI
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  // 1. Setup Typography to use the Next.js font
  typography: {
    fontFamily: roboto.style.fontFamily,
  },

  // 2. Define your color palette
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32', // A professional "Green" often used for AI/Success
    },
    background: {
      default: '#f8f9fa', // A light grey background makes white Chat bubbles pop
    },
  },

  // 3. Optional: Global component overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Make buttons slightly rounded
          textTransform: 'none', // Stop buttons from being ALL CAPS
        },
      },
    },
  },
});

export default theme;