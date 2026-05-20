import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6F00',
      light: '#FFD180',
      dark: '#C43E00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#7B61FF',
      light: '#9F8CFF',
      dark: '#4B2BFF',
      contrastText: '#FFFFFF',
    },
    tertiary: { main: '#00D2FF' },
    background: {
      default: 'radial-gradient(1200px 600px at 10% 10%, rgba(123,97,255,0.10), transparent 10%), radial-gradient(1000px 500px at 90% 90%, rgba(255,111,0,0.06), transparent 10%), linear-gradient(180deg,#071428 0%, #0b1f33 100%)',
      paper: '#0B1220',
    },
    success: { main: '#2ECC71' },
    warning: { main: '#F39C12' },
    error: { main: '#E74C3C' },
    info: { main: '#3498DB' },
    text: {
      primary: '#E6EDF3',
      secondary: '#8B949E',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: '"Roboto", "Inter", sans-serif',
    h1: { fontWeight: 800, fontSize: '2.25rem' },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, letterSpacing: '0.06em', textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, rgba(123,97,255,0.12), rgba(255,111,0,0.12))',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px) saturate(140%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#161B22',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#161B22',
          border: '1px solid rgba(255,255,255,0.07)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
          padding: '10px 16px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF6F00 0%, #7B61FF 100%)',
          boxShadow: '0 8px 40px rgba(123,97,255,0.18)',
          color: '#FFF',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 14px 40px rgba(123,97,255,0.24)',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'radial-gradient(1200px 600px at 10% 10%, rgba(123,97,255,0.05), transparent 10%), radial-gradient(1000px 500px at 90% 90%, rgba(255,111,0,0.04), transparent 10%), linear-gradient(180deg,#071428 0%, #0b1f33 100%)',
          backgroundAttachment: 'fixed',
          color: '#E6EDF3',
          "--brand-gradient": 'linear-gradient(135deg, #FF6F00 0%, #7B61FF 100%)',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#0D1117',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          height: 64,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#8B949E',
          '&.Mui-selected': {
            color: '#FF6F00',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
            '&:hover fieldset': { borderColor: '#FF6F00' },
            '&.Mui-focused fieldset': { borderColor: '#FF6F00' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: '#FF6F00', height: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': { color: '#FF6F00' },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)' },
        bar: { borderRadius: 4 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: '#071428',
            color: '#CDE6FF',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(255,111,0,0.04)' },
          '& .MuiTableCell-root': { borderBottom: '1px solid rgba(255,255,255,0.04)' },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundColor: '#0F1720', backgroundImage: 'none', borderRadius: 14 },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: { backgroundColor: 'transparent' },
      },
    },
  },
});

export default theme;
