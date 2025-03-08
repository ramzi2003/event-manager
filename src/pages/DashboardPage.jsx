import { useState, useEffect } from "react";
import CustomDrawer from "../layout/CustomDrawer";
import dataService from "../services/dataService";
import { useSelector } from "react-redux";

function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverSecondary, setIsHoverSecondary] = useState(false);
  const [tasks, setTasks] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const fetchEvents = async () => {
    try {
      const eventsData = await dataService.fetchEvents();
      const currentDate = new Date();
      const filteredAndSortedEvents = eventsData
        .filter(event => new Date(event.end_date) >= currentDate)
        .sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
      setEvents(filteredAndSortedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchTasks = async (eventId) => {
    try {
      const tasksData = await dataService.fetchTasks();
      const filteredTasks = tasksData.filter((task) => task.event === eventId);
      setTasks(filteredTasks);
    } catch (error) {
      console.log("Error fetching tasks:", error)
    }
  };

  const getImportanceClasses = (importance) => {
    switch (importance) {
      case "high":
        return {
          bgClass: "bg-red-100 ",
          textClass: "text-red-600 ",
          iconColor: "text-red-600",
        };
      case "medium":
        return {
          bgClass: "bg-orange-100 ",
          textClass: "text-yellow-500 ",
          iconColor: "text-yellow-500",
        };
      case "low":
      default:
        return {
          bgClass: "bg-blue-100 ",
          textClass: "text-blue-600 ",
          iconColor: "text-blue-600",
        };
    }
  };

  const handleOpenDrawer = (event) => {
    setSelectedEvent(event);
    fetchTasks(event.id)
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  return (
    <>
      <div className="h-full overflow-y-scroll px-2 scroll-smooth ">
        <ol className="relative border-l border-gray-200">
          {events.map((event) => {
            const { iconColor } = getImportanceClasses(event.importance);
            return (
              <li
                key={event.id}
                className="mb-4 ml-8 border-b border-gray-200 pb-4"
              >
                <span className="absolute flex items-center justify-center w-5 h-5 rounded-full -left-2.5 ring-4 ring-white dark:ring-gray-900">
                  <svg
                    aria-hidden="true"
                    className={`w-5 h-5 ${iconColor}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"></path>
                  </svg>
                </span>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {new Date(event.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {event.name}
                </h3>
                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                  {event.description}
                </p>
                <button
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer"
                  onClick={() => handleOpenDrawer(event)}
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
            );
          })}
        </ol>
      </div>

      {selectedEvent && (
        <CustomDrawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedEvent={selectedEvent}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          isHoverSecondary={isHoverSecondary}
          setIsHoverSecondary={setIsHoverSecondary}
          getImportanceClasses={getImportanceClasses}
          tasks={tasks}
          user={user}
        />
      )}
    </>
  );
}

export default DashboardPage;