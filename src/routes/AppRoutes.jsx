import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "../pages/LoginPage";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import WrapperLayout from "../layout/WrapperLayout";

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);
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
          <Route path="/dashboard" element={<>This is the dashboard page</>} />
          <Route path="/tasks" element={<div>Tasks Component Here</div>} />
          <Route element={<RoleBasedRoute isAdminRequired={true} />}>
            <Route
              path="/view-all-events"
              element={<div>View all events Component Here</div>}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
