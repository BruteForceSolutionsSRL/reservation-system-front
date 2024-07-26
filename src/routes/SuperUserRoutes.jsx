import { Routes, Route } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import Homepage from "../Pages/User/Homepage/Homepage";
import Disponibility from "../Pages/Environment/Disponibility";
import EnvironmentRegistration from "../Pages/SuperUser/EnvironmentRegistration/EnvironmentRegistration";
import AttentionList from "../Pages/SuperUser/AttentionRequests/AttentionList";
import SpecialList from "../Pages/SuperUser/HandleSpecialRequests/AttentionList";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import EditEnvironment from "../Pages/SuperUser/EditEnvironment/EditEnvironment";
import DeleteEnvironment from "../Pages/SuperUser/DeleteEnvironment/DeleteEnvironment";
import GenerateReport from "../Pages/SuperUser/Reports/GenerateReport";
import StatisticsAmbience from "../Pages/Statistics/Ambience/StatisticsAmbience";
import SendNotification from "../Pages/SuperUser/SendNotification/SendNotification";
import BlockRegister from "../Pages/SuperUser/BlockRegister/BlockRegister";
import EditBlock from "../Pages/SuperUser/EditBlock/EditBlock";
import DeleteBlock from "../Pages/SuperUser/DeleteBlock/DeleteBlock";
import ProtectedRoute from "./ProtectedRoute";
import SeeNotifications from "../Pages/User/SeeNotifications/SeeNotifications";
import SingleNotification from "../Pages/User/SeeNotifications/SingleNotification";
import SpecialRequest from "../Pages/SuperUser/SpecialRequest/SpecialRequest";
import ManagmentGroups from "../Pages/SuperUser/Groups/Managment/ManagmentGroups";
import HistoryGroups from "../Pages/SuperUser/Groups/History/HistoryGroups";

export default function SuperUserRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute allowedRoles={["superuser"]}>
            <Sidebar user="superuser" />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<Homepage />}></Route>
        <Route path="environments-disponibility" element={<Disponibility />} />
        <Route
          path="environment-register"
          element={<EnvironmentRegistration />}
        ></Route>
        <Route path="attention-list" element={<AttentionList />}></Route>
        <Route path="special-attention-list" element={<SpecialList />}></Route>
        <Route path="edit-environment" element={<EditEnvironment />}></Route>
        <Route path="delete-environment" element={<DeleteEnvironment />} />
        <Route path="block-register" element={<BlockRegister />} />
        <Route path="edit-block" element={<EditBlock />} />
        <Route path="delete-block" element={<DeleteBlock />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="statistics-ambience" element={<StatisticsAmbience />} />
        <Route path="send-notification" element={<SendNotification />} />
        <Route path="generate-report" element={<GenerateReport />} />
        <Route path="notifications-list" element={<SeeNotifications />} />
        <Route
          path="notifications/:notificationId"
          element={<SingleNotification />}
        />
        <Route path="request" element={<SpecialRequest />} />
        <Route path="groups" element={<ManagmentGroups />} />
        <Route path="groups/history" element={<HistoryGroups />} />
      </Route>
    </Routes>
  );
}
