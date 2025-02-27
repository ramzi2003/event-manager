import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RoleBasedRoute = ({ isAdminRequired }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdminRequired && !user.is_admin) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

RoleBasedRoute.propTypes = {
  isAdminRequired: PropTypes.bool.isRequired,
};

export default RoleBasedRoute;