import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { useContext } from "react";
import { GlobalContext } from "./contexts/GlobalContext.ts";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import RoutesCheck from "./authorization/RoutesCheck.tsx";
import Signup from "./pages/Signup.tsx";
import { ToastContainer } from "react-toastify";
import Loader from "./Components/Loader.tsx";
import Post from "./pages/Post.tsx";
import Profile from "./pages/Profile.tsx";
import ChatRoom from "./pages/ChatRoom.tsx";
import SearchProfile from "./pages/SearchProfile.tsx";

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
          <Route element={<RoutesCheck route="private" />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/post" element={<Post />} />
            <Route path="/chat-room" element={<ChatRoom />} />
            <Route path="/search" element={<SearchProfile />} />
          </Route>
          {/* Public Routes */}
          <Route element={<RoutesCheck route="public" />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
      <Loader />
    </ThemeProvider>
  );
}

export default App;
