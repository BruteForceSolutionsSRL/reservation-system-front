import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import LandingPage from "./Pages/LandingPage/LandingPage";
import UserRoutes from "./routes/UserRoutes";
import SuperUserRoutes from "./routes/SuperUserRoutes";
import { useState } from "react";

export default function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          path="/"
          element={
            <LandingPage setAuthToken={setAuthToken} authToken={authToken} />
          }
        />
        <Route
          path="/user/*"
          element={<UserRoutes setAuthToken={setAuthToken} />}
        />
        <Route path="/superuser/*" element={<SuperUserRoutes />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
