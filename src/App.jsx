import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import LandingPage from "./Pages/LandingPage/LandingPage";
import UserRoutes from "./routes/UserRoutes";
import SuperUserRoutes from "./routes/SuperUserRoutes";
import Home from "./Pages/User/Homepage/Home";
import LoginPage from "./Components/LoginPage/LoginPage";
import { AuthProvider } from "./contexts/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home />} />
          {/* <Route index path="/login" element={<LandingPage />} /> */}
          <Route index path="/login" element={<LoginPage />} />
          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/superuser/*" element={<SuperUserRoutes />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
