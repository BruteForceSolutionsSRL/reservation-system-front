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
import SubjectsList from "../Pages/SuperUser/SubjectsList/SubjectsList";
import EnterManagement from "../Pages/SuperUser/AcademicManagement/EnterManagement/EnterManagement";
import RegisterManagement from "../Pages/SuperUser/AcademicManagement/RegisterManagement/RegisterManagement";
import EditManagement from "../Pages/SuperUser/AcademicManagement/EditManagement/EditManagement";
import RegisterPeriod from "../Pages/SuperUser/AcademicPeriod/RegisterPeriod/RegisterPeriod";
import EditPeriod from "../Pages/SuperUser/AcademicPeriod/EditPeriod/EditPeriod";
import CopyPeriod from "../Pages/SuperUser/AcademicPeriod/CopyPeriod/CopyAcademicPeriod";
import RegisterUser from "../Pages/SuperUser/RegisterUser/RegisterUser";
import InformationUser from "../Pages/User/InformationUser/InformationUser";
import EditRolList from "../Pages/SuperUser/EditRol/EditRolList";

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
        {/* <Route path="enter-management" element={<EnterManagement />} /> */}
        <Route path="register-management" element={<RegisterManagement />} />
        <Route path="edit-management" element={<EditManagement />} />

        <Route path="register-period" element={<RegisterPeriod />} />
        <Route path="edit-period" element={<EditPeriod />} />
        <Route path="copy-period" element={<CopyPeriod />} />

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
        {/* <Route path="groups/history" element={<HistoryGroups />} /> */}
        <Route path="subjects" element={<SubjectsList />} />
        <Route path="register-user" element={<RegisterUser />} />
        <Route path="information-user" element={<InformationUser />} />
        <Route path="edit-rol" element={<EditRolList />} />
      </Route>
    </Routes>
  );
}
