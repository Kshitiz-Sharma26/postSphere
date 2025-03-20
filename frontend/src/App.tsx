import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalContextProvider from "./contexts/GlobalContextProvider";
import "./App.css";

function App() {
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <Routes>
          {/* Private Routes */}
          <Route element={<></>}>
            <Route path="/home" element={<></>} />
            <Route path="/profile" element={<></>} />
            <Route path="/edit-profile" element={<></>} />
          </Route>
          {/* Public Routes */}
          <Route element={<></>}>
            <Route path="/login" element={<></>} />
          </Route>
        </Routes>
      </BrowserRouter>
      hello
    </GlobalContextProvider>
  );
}

export default App;
