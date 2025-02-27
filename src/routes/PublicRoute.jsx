import { Outlet, Navigate } from "react-router-dom";
import { useSelector} from "react-redux";

const PublicRoute = () => {
    const { user } = useSelector((state) => state.auth);
    return !user ? <Outlet /> : <Navigate to='/dashboard' />;
};

export default PublicRoute