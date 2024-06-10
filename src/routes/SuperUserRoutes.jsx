import { Routes, Route } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import Homepage from "../Pages/User/Homepage/Homepage";
import Disponibility from "../Pages/Environment/Disponibility";
import EnvironmentRegistration from "../Pages/SuperUser/EnvironmentRegistration/EnvironmentRegistration";
import AttentionList from "../Pages/SuperUser/AttentionRequests/AttentionList";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import RequestsHistory from "../Pages/RequestsHistory/RequestsHistory";
import EditEnvironment from "../Pages/SuperUser/EditEnvironment/EditEnvironment";
import DeleteEnvironment from "../Pages/SuperUser/DeleteEnvironment/DeleteEnvironment";
import StatisticsAmbience from "../Pages/Statistics/Ambience/StatisticsAmbience";

export default function SuperUserRoutes() {
  return (
    <Routes>
      <Route element={<Sidebar user="superuser" />}>
        <Route path="home" element={<Homepage />}></Route>
        <Route path="environments-disponibility" element={<Disponibility />} />
        <Route
          path="environment-register"
          element={<EnvironmentRegistration />}
        ></Route>
        <Route path="attention-list" element={<AttentionList />}></Route>
        <Route path="edit-environment" element={<EditEnvironment />}></Route>
        <Route path="delete-environment" element={<DeleteEnvironment />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="statistics-ambience" element={<StatisticsAmbience />} />
      </Route>
    </Routes>
  );
}
