import { createTheme } from '@mui/material/styles';

// Colores UTSJR (ajustar según identidad visual)
const colors = {
  primary: {
    main: '#0056b3',
    light: '#4d82c3',
    dark: '#003a7a',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#12a778',
    light: '#64d8a8',
    dark: '#00764a',
    contrastText: '#ffffff',
  },
  error: {
    main: '#f44336',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
};

const theme = createTheme({
  palette: {
    ...colors,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;