import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftStartOnRectangleIcon,
  DocumentIcon,
  DocumentPlusIcon,
  FolderPlusIcon,
  HomeIcon,
  InformationCircleIcon,
  RectangleStackIcon,
  UserGroupIcon,
  UserPlusIcon,
  ViewfinderCircleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useState } from "react";
import Modal from "./modals/Modal"

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const isDropdownActive = (paths) =>
    paths.some((path) => location.pathname.startsWith(path));

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const openLogoutModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="h-screen w-64 pb-10 select-none">
        <div className="flex h-full flex-grow flex-col overflow-y-auto no-scrollbar bg-white pt-5">
          <div className="flex mt-3 flex-1 flex-col">
            <div className="">
              <nav className="flex-1">
                <Link
                  to="/dashboard"
                  title=""
                  className={`flex cursor-pointer items-center py-2 px-4 text-sm font-medium  outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-blue-600 hover:text-blue-600 ${
                    isActive("/dashboard")
                      ? "border-l-4 border-l-blue-600 text-blue-600"
                      : "text-gray-600"
                  } `}
                >
                  <HomeIcon className="mr-4 h-5 w-5 align-middle" />
                  Dashboard
                </Link>

                <Link
                  to="/tasks"
                  className={`flex cursor-pointer items-center py-2 px-4 text-sm font-medium  outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-blue-600 hover:text-blue-600 ${
                    isActive("/tasks")
                      ? "border-l-4 border-l-blue-600 text-blue-600"
                      : "text-gray-600"
                  } `}
                >
                  <RectangleStackIcon className="mr-4 h-5 w-5 align-middle" />
                  Tasks
                  <span className="ml-auto rounded-full bg-blue-600 px-2 text-xs text-white">
                    6
                  </span>
                </Link>

                <Link
                  to="/my-profile"
                  className={`flex cursor-pointer items-center py-2 px-4 text-sm font-medium  outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-blue-600 hover:text-blue-600 ${
                    isActive("/my-profile")
                      ? "border-l-4 border-l-blue-600 text-blue-600"
                      : "text-gray-600"
                  } `}
                >
                  <InformationCircleIcon className="mr-4 h-5 w-5 align-middle" />
                  My Info
                </Link>

                <button
                  onClick={openLogoutModal}
                  className="flex cursor-pointer items-center border-l-blue-600 py-2 px-4 text-sm font-medium text-gray-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-blue-600 hover:text-blue-600 "
                >
                  <ArrowLeftStartOnRectangleIcon className="mr-4 h-5 w-5 align-middle" />
                  Log Out
                </button>
              </nav>

              {user && user.is_admin && (
                <>
                  <span className="ml-3 mt-10 mb-2 block text-xs font-semibold text-gray-500">
                    Admin Panel
                  </span>

                  <nav className="flex-1">
                    <div className="relative transition">
                      <input
                        className="peer hidden"
                        type="checkbox"
                        id="menu-1"
                        defaultChecked={isDropdownActive([
                          "/view-events",
                          "/create-event",
                        ])}
                      />
                      <button className="flex peer relative w-full items-center border-l-blue-600 py-3 px-4 text-sm font-medium text-gray-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:text-blue-600 ">
                        <CalendarIcon className="mr-4 h-5 w-5 align-middle" />
                        Events
                        <label
                          htmlFor="menu-1"
                          className="absolute inset-0 h-full w-full cursor-pointer"
                        ></label>
                      </button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute right-0 top-4 ml-auto mr-5 h-4 text-gray-600 transition peer-checked:rotate-180 peer-hover:text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      <ul className="duration-400 flex max-h-0 flex-col overflow-hidden rounded-xl bg-gray-100 font-medium transition-all duration-300 peer-checked:max-h-96">
                        <Link to="/view-events">
                          <li className="flex m-2 cursor-pointer border-l-blue-600 py-3 pl-5 text-sm text-gray-600 transition-all duration-100 ease-in-out hover:border-l-4 hover:text-blue-600">
                            <ViewfinderCircleIcon className="mr-4 h-5 w-5 align-middle" />
                            View Events
                          </li>
                        </Link>
                        <Link to="/create-event">
                          <li className="flex m-2 cursor-pointer border-l-blue-600 py-3 pl-5 text-sm text-gray-600 transition-all duration-100 ease-in-out hover:border-l-4 hover:text-blue-600">
                            <FolderPlusIcon className="mr-4 h-5 w-5 align-middle" />
                            Create Event
                          </li>
                        </Link>
                      </ul>
                    </div>
                    <div className="relative transition">
                      <input
                        className="peer hidden"
                        type="checkbox"
                        id="menu-2"
                        defaultChecked={isDropdownActive([
                          "/view-tasks",
                          "/create-tasks",
                        ])}
                      />
                      <button className="flex peer relative w-full items-center border-l-blue-600 py-3 px-4 text-sm font-medium text-gray-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:text-blue-600 ">
                        <DocumentIcon className="mr-4 h-5 w-5 align-middle" />
                        Tasks
                        <label
                          htmlFor="menu-2"
                          className="absolute inset-0 h-full w-full cursor-pointer"
                        ></label>
                      </button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute right-0 top-4 ml-auto mr-5 h-4 text-gray-600 transition peer-checked:rotate-180 peer-hover:text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      <ul className="duration-400 flex max-h-0 flex-col overflow-hidden rounded-xl bg-gray-100 font-medium transition-all duration-300 peer-checked:max-h-96">
                        <Link to="/view-tasks">
                          <li className="flex m-2 cursor-pointer border-l-blue-600 py-3 pl-5 text-sm text-gray-600 transition-all duration-100 ease-in-out hover:border-l-4 hover:text-blue-600">
                            <ViewfinderCircleIcon className="mr-4 h-5 w-5 align-middle" />
                            View Tasks
                          </li>
                        </Link>
                        <Link to="/create-tasks">
                          <li className="flex m-2 cursor-pointer border-l-blue-600 py-3 pl-5 text-sm text-gray-600 transition-all duration-100 ease-in-out hover:border-l-4 hover:text-blue-600">
                            <DocumentPlusIcon className="mr-4 h-5 w-5 align-middle" />
                            Create Task
                          </li>
                        </Link>
                      </ul>
                    </div>
                    <div className="relative transition">
                      <input
                        className="peer hidden"
                        type="checkbox"
                        id="menu-3"
                        defaultChecked={isDropdownActive([
                          "/view-users",
                          "/create-user",
                        ])}
                      />
                      <button className="flex peer relative w-full items-center border-l-blue-600 py-3 px-4 text-sm font-medium text-gray-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:text-blue-600 ">
                        <UserGroupIcon className="mr-4 h-5 w-5 align-middle" />
                        Users
                        <label
                          htmlFor="menu-3"
                          className="absolute inset-0 h-full w-full cursor-pointer"
                        ></label>
                      </button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute right-0 top-4 ml-auto mr-5 h-4 text-gray-600 transition peer-checked:rotate-180 peer-hover:text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      <ul className="duration-400 flex max-h-0 flex-col overflow-hidden rounded-xl bg-gray-100 font-medium transition-all duration-300 peer-checked:max-h-96">
                        <Link to="/view-users">
                          <li className="flex m-2 cursor-pointer border-l-blue-600 py-3 pl-5 text-sm text-gray-600 transition-all duration-100 ease-in-out hover:border-l-4 hover:text-blue-600">
                            <ViewfinderCircleIcon className="mr-4 h-5 w-5 align-middle" />
                            View Users
                          </li>
                        </Link>
                        <Link to="/create-user">
                          <li className="flex m-2 cursor-pointer border-l-blue-600 py-3 pl-5 text-sm text-gray-600 transition-all duration-100 ease-in-out hover:border-l-4 hover:text-blue-600">
                            <UserPlusIcon className="mr-4 h-5 w-5 align-middle" />
                            Create User
                          </li>
                        </Link>
                      </ul>
                    </div>
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
     <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        type="logout"
        title="Logout"
        message="Are you sure you want to logout?"
        icon={ArrowLeftStartOnRectangleIcon}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default Sidebar;
