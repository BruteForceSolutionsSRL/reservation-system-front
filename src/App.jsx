import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import Homepage from "./Pages/User/Homepage/Homepage";
import Sidebar from "./Components/Sidebar.jsx/Sidebar";
import LandingPage from "./Pages/LandingPage/LandingPage";
import EnvironmentRegistration from "./Pages/SuperUser/EnvironmentRegistration/EnvironmentRegistration";
import RequestsList from "./Pages/SuperUser/RequestsList/RequestsList";
import RequestReservationAmbience from "./Components/RequestReservationAmbience/RequestReservationAmbience";
import AttentionList from "./Pages/SuperUser/AttentionRequests/AttentionList";
import Disponibility from "./Pages/Environment/Disponibility";
import ListCancel from "./Pages/User/ListCancel/ListCancel";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<LandingPage />}></Route>
        <Route path="/user" element={<Sidebar user="user" />}>
          <Route path="home" element={<Homepage />}></Route>
          <Route
            path="enviroment-request"
            element={<RequestReservationAmbience />}
          ></Route>
          <Route
            path="environments-disponibility"
            element={<Disponibility />}
          />
          <Route path="list-cancel" element={<ListCancel />} />
        </Route>
        <Route path="/superuser" element={<Sidebar user="superuser" />}>
          <Route path="home" element={<Homepage />}></Route>
          <Route
            path="reservation-request"
            element={<div>Pagina para Lista de solicitudes</div>}
          ></Route>
          <Route
            path="environments-disponibility"
            element={<Disponibility />}
          />
          <Route
            path="environment-register"
            element={<EnvironmentRegistration />}
          ></Route>
          <Route
            path="reservations-list-superuser"
            element={<RequestsList />}
          ></Route>
          <Route path="attention-list" element={<AttentionList />}></Route>
        </Route>
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
