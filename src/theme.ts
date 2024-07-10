import { createTheme } from '@mui/material/styles';

// Define a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#142672',
    },
    secondary: {
      main: '#424242',
    },
    error: {
      main: '#b71c1c',
    },
    // Optional: define accent color
    // You can define other palette colors as needed
    // accent: {
    //   main: '#ED1B24',
    // },
  },
  typography: {
    // Optional: define typography options
  },
  // Optional: define other theme options
});

export default theme;
