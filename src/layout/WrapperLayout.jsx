import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const WrapperLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <div className="bg-blue-500 h-50 w-50-full clip-trapezoid"></div>
        <div className="bg-white m-4 -mt-26 z-10 relative p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WrapperLayout;
