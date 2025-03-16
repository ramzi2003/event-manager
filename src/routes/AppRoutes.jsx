import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import LoginPage from "../pages/LoginPage";
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
            task.responsible_department === user.department.id
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
        <Route
          path="/forgot-password"
          element={<div>Forgot password Component Here</div>}
        />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<WrapperLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route element={<RoleBasedRoute isAdminRequired={true} />}>
            <Route
              path="/view-events"
              element={<ViewEvents />}
            />
            <Route 
              path="/create-event"
              element={<CreateEvent />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;