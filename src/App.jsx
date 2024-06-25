import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import UserRoutes from "./routes/UserRoutes";
import SuperUserRoutes from "./routes/SuperUserRoutes";
import Home from "./Pages/User/Homepage/Home";
import LoginPage from "./Components/LoginPage/LoginPage";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superuser/*"
            element={
              <ProtectedRoute allowedRoles={["superuser"]}>
                <SuperUserRoutes />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
