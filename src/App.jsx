import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import Homepage from "./Pages/User/Homepage/Homepage";
import Sidebar from "./Components/Sidebar.jsx/Sidebar";
import EnvironmentRequest from "./Pages/EnvironmentRequest/EnvironmentRequest";
import LandingPage from "./Pages/LandingPage/LandingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<LandingPage />}></Route>
        <Route path="/user" element={<Sidebar user="user" />}>
          <Route path="home" element={<Homepage />}></Route>
          <Route
            path="enviroment-request"
            element={<EnvironmentRequest />}
          ></Route>
          <Route
            path="user-manual"
            element={<div>Pagina para manual de usuario</div>}
          ></Route>
        </Route>
        <Route path="/superuser" element={<Sidebar user="superuser" />}>
          <Route path="home" element={<Homepage />}></Route>
          <Route
            path="reservation-request"
            element={<div>Pagina para Lista de solicitudes</div>}
          ></Route>
          <Route
            path="superuser-manual"
            element={<div>Pagina para manual de superusuario</div>}
          ></Route>
        </Route>
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
