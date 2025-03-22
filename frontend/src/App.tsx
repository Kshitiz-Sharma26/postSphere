import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { useContext } from "react";
import { GlobalContext } from "./contexts/GlobalContext.ts";
import PrivateRoutes from "./authorization/PrivateRoutes.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";

function App() {
  const globalState = useContext(GlobalContext);
  const { state } = globalState;
  const { theme } = state;
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: theme,
        },
      })}
    >
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Private Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="" element={<Home />} />
            <Route path="/profile" element={<></>} />
            <Route path="/edit-profile" element={<></>} />
          </Route>
          {/* Public Routes */}
          <Route element={<></>}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
