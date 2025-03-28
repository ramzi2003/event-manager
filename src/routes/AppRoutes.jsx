import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import LoginPage from "../pages/public/LoginPage";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import WrapperLayout from "../layout/WrapperLayout";
import MyProfilePage from "../pages/MyProfilePage";
import TasksPage from "../pages/TasksPage";
import DashboardPage from "../pages/DashboardPage";
import dataService from "../services/dataService";
import { setTaskCount } from "../store/taskSlice";
import ViewEvents from "../pages/admin/events/ViewEvents";
import CreateEvent from "../pages/admin/events/CreateEvent";
import EditEvent from "../pages/admin/events/EditEvent";
import ViewTasks from "../pages/admin/tasks/ViewTasks";
import CreateTask from "../pages/admin/tasks/Createtask";
import EditTask from "../pages/admin/tasks/EditTask";
import ViewUsers from "../pages/admin/users/ViewUsers";
import CreateUser from "../pages/admin/users/CreateUser";
import EditUser from "../pages/admin/users/EditUser";
import ForgotPassword from "../pages/public/ForgotPassword";
import EmailSuccess from "../layout/EmailSuccess";
import ResetPassword from "../pages/public/ResetPassword";

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await dataService.fetchTasks();
        const countTasks = tasksData.filter(
          (task) =>
            (task.status === "not_started" || task.status === "in_progress") &&
            task.responsible_department === user.department
        ).length;
        dispatch(setTaskCount(countTasks));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [dispatch, user]);

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-success" element={<EmailSuccess />} />
        <Route
          path="/auth/users/reset_password_confirm/:uid/:token/"
          element={<ResetPassword />}
        />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<WrapperLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route element={<RoleBasedRoute isAdminRequired={true} />}>
            <Route path="/view-events" element={<ViewEvents />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/edit-event/:eventId" element={<EditEvent />} />
            <Route path="/view-tasks" element={<ViewTasks />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/edit-task/:taskId" element={<EditTask />} />
            <Route path="/view-users" element={<ViewUsers />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/edit-user/:userId" element={<EditUser />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
