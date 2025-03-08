import { useState } from "react";
import CustomDrawer from "../layout/Drawer";

function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent] = useState({
    name: "Event Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit, incidunt? Fuga voluptatum quod debitis temporibus eius, accusamus, possimus quia facere aspernatur adipisci accusantium explicabo quidem expedita qui recusandae. Autem, voluptates.",
    start_date: "2024-03-10",
    end_date: "2024-03-11",
    room: "Room 101",
    accommodation: true,
    gl_cc_info: "GL12345",
    payment_status: "paid",
    purchase_requisition: "PR12345",
    importance: "high",
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverSecondary, setIsHoverSecondary] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const getImportanceClasses = (importance) => {
    switch (importance) {
      case "high":
        return {
          bgClass: "bg-red-100 ",
          textClass: "text-red-600 ",
        };
      case "medium":
        return {
          bgClass: "bg-orange-100 ",
          textClass: "text-yellow-500 ",
        };
      case "low":
      default:
        return {
          bgClass: "bg-blue-100 ",
          textClass: "text-blue-600 ",
        };
    }
  };

  return (
    <>
      <div className="h-full overflow-y-scroll px-2 scroll-smooth ">
        <ol className="relative border-l border-gray-200">
          <li className="mb-4 ml-8 border-b border-gray-200 pb-4">
            <span className="absolute flex items-center justify-center w-5 h-5 rounded-full -left-2.5 ring-4 ring-white dark:ring-gray-900">
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"></path>
              </svg>
            </span>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              Mar 10, 2024
            </time>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Event Name
            </h3>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit,
              incidunt? Fuga voluptatum quod debitis temporibus eius, accusamus,
              possimus quia facere aspernatur adipisci accusantium explicabo
              quidem expedita qui recusandae. Autem, voluptates.
            </p>
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer"
              onClick={toggleDrawer}
            >
              Check Details
              <svg
                className="w-3 h-3 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </li>
        </ol>
      </div>

      <CustomDrawer
        isOpen={isOpen}
        toggleDrawer={toggleDrawer}
        selectedEvent={selectedEvent}
        isHovered={isHovered}
        setIsHovered={setIsHovered}
        isHoverSecondary={isHoverSecondary}
        setIsHoverSecondary={setIsHoverSecondary}
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
        getImportanceClasses={getImportanceClasses}
      />
    </>
  );
}

export default DashboardPage;
