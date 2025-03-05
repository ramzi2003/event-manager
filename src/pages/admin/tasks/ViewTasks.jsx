import { useState, useEffect } from "react";
import dataService from "../services/dataService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isSameMonth } from "date-fns";

const ViewTasks = () => {
  const [departments, setDepartments] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentsData = await dataService.fetchDepartments();
        setDepartments(departmentsData);

        const eventsData = await dataService.fetchEvents();
        setEvents(eventsData);

        const tasksData = await dataService.fetchTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "not_started":
        return {
          color: "text-gray-800",
          bgColor: "bg-gray-100",
          text: "Not Started",
        };
      case "in_progress":
        return {
          color: "text-blue-800",
          bgColor: "bg-blue-100",
          text: "In Progress",
        };
      case "completed":
        return {
          color: "text-green-800",
          bgColor: "bg-green-100",
          text: "Completed",
        };
      default:
        return {
          color: "text-gray-800",
          bgColor: "bg-gray-100",
          text: "Unknown",
        };
    }
  };

  const isTaskInSelectedMonth = (task) => {
    if (!selectedMonth) return true;
    return isSameMonth(new Date(task.due_date), selectedMonth);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearchQuery = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || task.status === selectedStatus;
    const matchesDepartment =
      selectedDepartment === "all" ||
      task.responsible_department === parseInt(selectedDepartment);
    const matchesEvent =
      selectedEvent === "all" || task.event === parseInt(selectedEvent);
    const matchesMonth = isTaskInSelectedMonth(task);
    return (
      matchesSearchQuery &&
      matchesStatus &&
      matchesDepartment &&
      matchesEvent &&
      matchesMonth
    );
  });

  return (
    <>
      <div className=" border-b pb-3 border-gray-300">
        <div className="relative ">
          <div className="absolute flex items-center ml-2 h-full">
            <svg
              className="w-4 h-4 fill-current text-primary-gray-dark"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.8898 15.0493L11.8588 11.0182C11.7869 10.9463 11.6932 10.9088 11.5932 10.9088H11.2713C12.3431 9.74952 12.9994 8.20272 12.9994 6.49968C12.9994 2.90923 10.0901 0 6.49968 0C2.90923 0 0 2.90923 0 6.49968C0 10.0901 2.90923 12.9994 6.49968 12.9994C8.20272 12.9994 9.74952 12.3431 10.9088 11.2744V11.5932C10.9088 11.6932 10.9495 11.7869 11.0182 11.8588L15.0493 15.8898C15.1961 16.0367 15.4336 16.0367 15.5805 15.8898L15.8898 15.5805C16.0367 15.4336 16.0367 15.1961 15.8898 15.0493ZM6.49968 11.9994C3.45921 11.9994 0.999951 9.54016 0.999951 6.49968C0.999951 3.45921 3.45921 0.999951 6.49968 0.999951C9.54016 0.999951 11.9994 3.45921 11.9994 6.49968C11.9994 9.54016 9.54016 11.9994 6.49968 11.9994Z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {[
              {
                label: "Status",
                options: ["All", "Completed", "In Progress", "Not Started"],
              },
              {
                label: "Responsible Department",
                options: ["All", ...departments.map((dept) => dept.name)],
              },
              {
                label: "Event",
                options: ["All", ...events.map((event) => event.name)],
              },
            ].map((filter, index) => (
              <div key={index} className="relative">
                <select
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  onChange={
                    filter.label === "Status"
                      ? handleStatusChange
                      : filter.label === "Responsible Department"
                      ? handleDepartmentChange
                      : handleEventChange
                  }
                >
                  {filter.options.map((option, i) => (
                    <option
                      key={i}
                      value={
                        filter.label === "Responsible Department"
                          ? departments.find((dept) => dept.name === option)?.id || "all"
                          : filter.label === "Event"
                          ? events.find((event) => event.name === option)?.id || "all"
                          : option.toLowerCase().replace(/\s/g, "_")
                      }
                    >
                      {option}
                    </option>
                  ))}
                </select>
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
                  {filter.label}
                </label>
              </div>
            ))}
            <div className="relative">
              <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
                Month
              </label>
              <DatePicker
                selected={selectedMonth}
                onChange={handleMonthChange}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                isClearable
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="h-3/4 overflow-y-auto">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredTasks.map((task) => {
            const { color, bgColor, text } = getStatusStyles(task.status);
            return (
              <li
                key={task.id}
                className="flex justify-between gap-x-6 py-5 select-none cursor-pointer hover:bg-gray-100 px-2"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm/6 font-semibold text-gray-900">
                      {task.title}
                    </p>
                    <p className="mt-1 truncate text-xs/5 text-gray-500 w-2/3 break-words whitespace-normal">
                      {task.description}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p
                    className={`text-sm/6 ${bgColor} rounded-4xl px-2 flex items-center justify-center`}
                  >
                    <svg
                      className={`w-3 h-3 ${color} font-semibold mr-2`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    {text}
                  </p>
                  <p className="mt-1 text-xs/5 text-gray-500">
                    {format(new Date(task.due_date), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default ViewTasks;