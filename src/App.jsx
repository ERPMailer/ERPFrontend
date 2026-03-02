import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
import { routes } from "./routes/routes";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Navbar from "./components/navbar/navbar";
import { Provider } from "react-redux";
import store from "./store";

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#0d0d0d",
    },
    secondary: {
      main: "#9c27b0",
      
      
    },
    background: {
      default: "#f4f6f8",
      
    },
    common:{
      black: "#000",
      white: "#fff",
      blue:"rgba(31, 123, 252, 0.87)"
    }
    
  },
  
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "2rem",
    },
    body1: {
      fontSize: "1rem",
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const AppRoutes = () => useRoutes(routes);

function App() {
  const [count, setCount] = useState(0);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Resets MUI baseline styles */}
        <Router>
          {/* <Navbar /> */}

          <AppRoutes />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
