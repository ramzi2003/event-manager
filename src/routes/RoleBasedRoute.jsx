import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RoleBasedRoute = ({ isAdminRequired }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return null; // Stay on the same page if the user is not authenticated
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