import { createTheme } from '@mui/material/styles';

// Admin Theme - Orange & Black
export const adminTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6F00',
      light: '#FFB74D',
      dark: '#E65100',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1A1A1A',
      light: '#424242',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
      paper: '#1a1a1a',
    },
    success: { main: '#66BB6A' },
    warning: { main: '#FFA726' },
    error: { main: '#EF5350' },
    info: { main: '#29B6F6' },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
    divider: 'rgba(255, 111, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Inter", sans-serif',
    h1: { fontWeight: 800, fontSize: '2.5rem' },
    h2: { fontWeight: 700, fontSize: '2rem' },
    h3: { fontWeight: 700, fontSize: '1.75rem' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
          boxShadow: '0 8px 24px rgba(255, 111, 0, 0.4)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 32px rgba(255, 111, 0, 0.6)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
          border: '1px solid rgba(255, 111, 0, 0.1)',
          backgroundImage: 'linear-gradient(135deg, rgba(255, 111, 0, 0.05) 0%, rgba(255, 111, 0, 0) 100%)',
        },
      },
    },
  },
});

// Manager Theme - Blue & White
export const managerTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2',
      light: '#42A5F5',
      dark: '#1565C0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFFFFF',
      light: '#F5F5F5',
      dark: '#E0E0E0',
      contrastText: '#1976D2',
    },
    background: {
      default: '#F0F4F8',
      paper: '#FFFFFF',
    },
    success: { main: '#2E7D32' },
    warning: { main: '#F57C00' },
    error: { main: '#C62828' },
    info: { main: '#0277BD' },
    text: {
      primary: '#212121',
      secondary: '#666666',
    },
    divider: 'rgba(25, 118, 210, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Inter", sans-serif',
    h1: { fontWeight: 800, fontSize: '2.5rem', color: '#1565C0' },
    h2: { fontWeight: 700, fontSize: '2rem', color: '#1976D2' },
    h3: { fontWeight: 700, fontSize: '1.75rem' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
          boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 28px rgba(25, 118, 210, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(25, 118, 210, 0.1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

// Client Theme - Green & White
export const clientTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32',
      light: '#66BB6A',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFFFFF',
      light: '#F5F5F5',
      dark: '#E0E0E0',
      contrastText: '#2E7D32',
    },
    background: {
      default: '#F1F8E9',
      paper: '#FFFFFF',
    },
    success: { main: '#2E7D32' },
    warning: { main: '#F57C00' },
    error: { main: '#C62828' },
    info: { main: '#00ACC1' },
    text: {
      primary: '#1B5E20',
      secondary: '#558B2F',
    },
    divider: 'rgba(46, 125, 50, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Inter", sans-serif',
    h1: { fontWeight: 800, fontSize: '2.5rem', color: '#1B5E20' },
    h2: { fontWeight: 700, fontSize: '2rem', color: '#2E7D32' },
    h3: { fontWeight: 700, fontSize: '1.75rem' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
          boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 28px rgba(46, 125, 50, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(46, 125, 50, 0.1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

// Driver Theme - Yellow & Dark (Mobile-First)
export const driverTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFC107',
      light: '#FFE082',
      dark: '#FFA000',
      contrastText: '#000000',
    },
    secondary: {
      main: '#1A1A1A',
      light: '#424242',
      dark: '#000000',
      contrastText: '#FFC107',
    },
    background: {
      default: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      paper: '#262626',
    },
    success: { main: '#66BB6A' },
    warning: { main: '#FFA726' },
    error: { main: '#EF5350' },
    info: { main: '#64B5F6' },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
    divider: 'rgba(255, 193, 7, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Inter", sans-serif',
    h1: { fontWeight: 800, fontSize: '2rem' },
    h2: { fontWeight: 700, fontSize: '1.75rem' },
    h3: { fontWeight: 700, fontSize: '1.5rem' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)',
          color: '#000000',
          boxShadow: '0 8px 24px rgba(255, 193, 7, 0.4)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 32px rgba(255, 193, 7, 0.6)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#2d2d2d',
          border: '1px solid rgba(255, 193, 7, 0.1)',
          backgroundImage: 'linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 193, 7, 0) 100%)',
        },
      },
    },
  },
});

export const getThemeByRole = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return adminTheme;
    case 'manager':
      return managerTheme;
    case 'client':
      return clientTheme;
    case 'driver':
      return driverTheme;
    default:
      return adminTheme;
  }
};
