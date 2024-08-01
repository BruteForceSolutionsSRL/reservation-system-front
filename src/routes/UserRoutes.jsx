import { Route, Routes } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import Homepage from "../Pages/User/Homepage/Homepage";
import Disponibility from "../Pages/Environment/Disponibility";
import ListCancel from "../Pages/User/ListCancel/ListCancel";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import StatisticsAmbience from "../Pages/Statistics/Ambience/StatisticsAmbience";
import RequestsHistory from "../Pages/RequestsHistory/RequestsHistory";
import RequestReservation from "../Pages/User/RequestReservation/RequestReservation";
import SeeNotifications from "../Pages/User/SeeNotifications/SeeNotifications";
import SingleNotification from "../Pages/User/SeeNotifications/SingleNotification";
import ProtectedRoute from "./ProtectedRoute";
import FacultySelect from "../Pages/FacultySelect/FacultySelect";
import EnterManagement from "../Pages/SuperUser/AcademicManagement/EnterManagement/EnterManagement";

export default function UserRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Sidebar user="user" />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<Homepage />}></Route>
        <Route
          path="enviroment-request"
          element={<RequestReservation />}
        ></Route>
        <Route path="environments-disponibility" element={<Disponibility />} />
        <Route path="list-cancel" element={<ListCancel />} />
        <Route path="request-history" element={<RequestsHistory />} />
        <Route path="statistics-ambience" element={<StatisticsAmbience />} />
        <Route path="notifications-list" element={<SeeNotifications />} />
        <Route
          path="notifications/:notificationId"
          element={<SingleNotification />}
        />
        <Route path="enter-management" element={<EnterManagement />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
      <Route path="select-faculty" element={<FacultySelect />} />
    </Routes>
  );
}
