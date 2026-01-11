import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF1493', // Deep Pink
      light: '#FF69B4', // Hot Pink
      dark: '#C71585', // Medium Violet Red
      contrastText: '#fff',
    },
    secondary: {
      main: '#8A2BE2', // Blue Violet
      light: '#9370DB', // Medium Purple
      dark: '#4B0082', // Indigo
      contrastText: '#fff',
    },
    accent: {
      main: '#FFD700', // Gold
      orange: '#FF8C00', // Dark Orange
      cyan: '#00CED1', // Dark Turquoise
    },
    background: {
      default: '#fdfdfd',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255, 20, 147, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;
