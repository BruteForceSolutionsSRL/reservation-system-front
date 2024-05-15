import { Route, Routes } from "react-router-dom";
import Sidebar from "../Components/Sidebar.jsx/Sidebar";
import Homepage from "../Pages/User/Homepage/Homepage";
import RequestReservationAmbience from "../Components/RequestReservationAmbience/RequestReservationAmbience";
import Disponibility from "../Pages/Environment/Disponibility";
import ListCancel from "../Pages/User/ListCancel/ListCancel";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import RequestsHistory from "../Pages/RequestsHistory/RequestsHistory";

export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<Sidebar user="user" />}>
        <Route path="home" element={<Homepage />}></Route>
        <Route
          path="enviroment-request"
          element={<RequestReservationAmbience />}
        ></Route>
        <Route path="environments-disponibility" element={<Disponibility />} />
        <Route path="list-cancel" element={<ListCancel />} />
        <Route path="request-history" element={<RequestsHistory />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
