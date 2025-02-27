import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import { useSelector } from 'react-redux';

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<div>Forgot password Component Here</div>} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<div>Dashboard Component Here</div>} />
        <Route
          path="/view-all-events"
          element={
            <RoleBasedRoute isAdminRequired={true}>
              <div>View all events Component Here</div>
            </RoleBasedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <RoleBasedRoute isAdminRequired={false}>
              <div>Tasks Component Here</div>
            </RoleBasedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;