import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import dataService from "../services/dataService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isSameMonth } from "date-fns";
import { setTaskCount } from "../store/taskSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const TasksPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Local loading state
  const [departments, setDepartments] = useState([]);

  const handleOpen = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

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

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : "Unknown";
  };

  useEffect(() => {
    const countTasks = tasks.filter(
      (task) =>
        (task.status === "not_started" || task.status === "in_progress") &&
        task.responsible_department === user.department
    ).length;
    dispatch(setTaskCount(countTasks));
  }, [tasks, user, dispatch]);

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const handlePatchStatusChange = async (event) => {
    const newStatus = event.target.value;
    if (selectedTask) {
      setOpen(false);
      setLoading(true);
      try {
        await dataService.updateTaskStatus(selectedTask.id, newStatus);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTask.id ? { ...task, status: newStatus } : task
          )
        );
        toast.success("Status changed successfully");
        const tasksData = await dataService.fetchTasks();
        setTasks(tasksData);
        setLoading(false);
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error(error.response?.data?.message || "Failed to change status");
        setLoading(false);
      }
    }
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
    const matchesEvent =
      selectedEvent === "all" || task.event === parseInt(selectedEvent);
    const matchesMonth = isTaskInSelectedMonth(task);
    const matchesDepartment =
      user && task.responsible_department === user.department;
    return (
      matchesSearchQuery &&
      matchesStatus &&
      matchesEvent &&
      matchesMonth &&
      matchesDepartment
    );
  });

  return (
    <>
      <div
        className={`relative ${
          loading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <div className="border-b pb-3 border-gray-300">
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
                        : handleEventChange
                    }
                  >
                    {filter.options.map((option, i) => (
                      <option
                        key={i}
                        value={
                          filter.label === "Event"
                            ? events.find((event) => event.name === option)
                                ?.id || "all"
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
                  className=" w-full flex justify-between gap-x-6 py-5 select-none cursor-pointer hover:bg-gray-100 px-2"
                  onClick={() => handleOpen(task)}
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
                  <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
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
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="mt-20 md:mt-0 flex md:min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 md:w-1/2 w-full data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              {selectedTask && (
                <>
                  <div className="bg-white h-full px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <div className="flex justify-between items-top">
                          <DialogTitle
                            as="h3"
                            className="text-base font-semibold text-gray-900 text-xl"
                          >
                            {selectedTask.title}
                            <p className="text-sm text-gray-500 flex items-center justify-center italic">
                              {events.find(
                                (event) => event.id === selectedTask.event
                              )?.name || "Unknown"}
                            </p>
                          </DialogTitle>
                          <p className="text-xs text-gray-400 italic font-semibold">
                            {format(
                              new Date(selectedTask.due_date),
                              "MMM d, yyyy HH:mm"
                            )}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 text-left">
                            {selectedTask.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row justify-between items-center sm:px-6">
                    <p className="text-sm text-gray-500 italic">
                      <strong>Responsible Department:</strong> {getDepartmentName(selectedTask.responsible_department)}
                    </p>
                    <form>
                      <select
                        id="status"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-pointer"
                        defaultValue=""
                        onChange={handlePatchStatusChange}
                      >
                        <option value="" disabled hidden>
                          Status
                        </option>
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </form>
                  </div>
                </>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default TasksPage;
