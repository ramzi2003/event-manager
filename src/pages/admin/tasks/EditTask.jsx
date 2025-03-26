import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dataService from "../../../services/dataService";
import Notification from "../../../layout/modals/Notification";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

function EditTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [initialTaskData, setInitialTaskData] = useState({});
  const [isNonInteractive, setIsNonInteractive] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "",
    event: "",
    responsible_department: "",
  });
  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    icon: null,
    bgColor: "",
    color: "",
  });
  const [setLoading] = useState(true);
  const [setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const [task, eventsData, departmentsData] = await Promise.all([
          dataService.fetchTaskById(taskId),
          dataService.fetchEvents(),
          dataService.fetchDepartments(),
        ]);
        const formattedTask = {
          ...task,
          due_date: formatDate(task.due_date),
        };
        setTaskData(formattedTask);
        setInitialTaskData(formattedTask); // Store the initial task data
        setEvents(eventsData);
        setDepartments(departmentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task data:", error);
        setError(
          "Task not found or an error occurred while fetching the task data."
        );
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["title", "due_date", "status", "event", "responsible_department"];
    const isEmpty = requiredFields.every((field) => !taskData[field]);

    if (isEmpty) {
      setNotification({
        show: true,
        message: "The form is empty. Please fill in the required fields.",
        icon: <FaExclamationCircle />,
        bgColor: "bg-red-100",
        color: "text-red-500",
      });
      setTimeout(() => {
        setNotification({
          show: false,
          message: "",
          icon: null,
          bgColor: "",
          color: "",
        });
      }, 2000);
      return;
    }

    // Check if there are any changes
    const hasChanges = Object.keys(taskData).some(
      (key) => taskData[key] !== initialTaskData[key]
    );

    if (!hasChanges) {
      navigate("/view-tasks");
      return;
    }

    try {
      const existingTask = await dataService.fetchTasks();
      const tasksExist = existingTask.some(
        (task) => task.title === taskData.title && task.id !== taskId
      );

      if (tasksExist && taskData.title !== initialTaskData.title) {
        setNotification({
          show: true,
          message: "A task with the same name already exists.",
          icon: <FaExclamationCircle />,
          bgColor: "bg-red-100",
          color: "text-red-500",
        });
        setTimeout(() => {
          setNotification({
            show: false,
            message: "",
            icon: null,
            bgColor: "",
            color: "",
          });
        }, 2000);
        setTaskData((prevData) => ({
          ...prevData,
          title: initialTaskData.title,
        }));
      } else {
        const transformedValues = {
          ...taskData,
          due_date: new Date(taskData.due_date).toISOString(),
        };

        // Log the request data
        console.log("Request data:", transformedValues);

        await dataService.updateTask(taskId, transformedValues);
        setNotification({
          show: true,
          message: "Task updated successfully!",
          icon: <FaCheckCircle />,
          bgColor: "bg-green-100",
          color: "text-green-500",
        });
        setIsNonInteractive(true); // Make the page non-interactive
        setTimeout(() => {
          setNotification({
            show: false,
            message: "",
            icon: null,
            bgColor: "",
            color: "",
          });
          setIsNonInteractive(false); // Restore interactivity
          navigate("/view-tasks"); // Redirect to /view-events
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating task:", error);

      // Log detailed error information
      if (error.response && error.response.data) {
        console.error("Error details:", error.response.data);
        setNotification({
          show: true,
          message: `Error: ${error.response.data.message}`,
          icon: <FaExclamationCircle />,
          bgColor: "bg-red-100",
          color: "text-red-500",
        });
      } else {
        setNotification({
          show: true,
          message: "An unexpected error occurred.",
          icon: <FaExclamationCircle />,
          bgColor: "bg-red-100",
          color: "text-red-500",
        });
      }
    }
  };

  return (
    <>
      {notification.show && (
        <Notification
          text={notification.message}
          icon={notification.icon}
          bgColor={notification.bgColor}
          color={notification.color}
        />
      )}
      <div
        className={`h-full overflow-y-scroll scroll-smooth no-scrollbar${
          isNonInteractive ? " pointer-events-none" : ""
        }`}
      >
        <div className="text-center mt-12">
          <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
            <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
            Edit Task
          </div>
        </div>
        <form className="mx-auto" onSubmit={handleSubmit} autoComplete="off">
          <div className="grid grid-cols-2 gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="title"
                id="title"
                value={taskData.title}
                onChange={handleChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="title"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Title
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <textarea
                name="description"
                id="description"
                rows="1"
                value={taskData.description}
                onChange={handleChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer resize-none"
                placeholder=" "
              ></textarea>
              <label
                htmlFor="description"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Description
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <div className="flex gap-4 items-center">
                <input
                  type="datetime-local"
                  name="due_date"
                  id="due_date"
                  value={taskData.due_date}
                  onChange={handleChange}
                  className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                />
              </div>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="status"
                id="status"
                value={taskData.status}
                onChange={handleChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <label
                htmlFor="status"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Status
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="event"
                id="event"
                value={taskData.event}
                onChange={handleChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
              >
                <option value="" disabled>
                  Select Event
                </option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              <label
                htmlFor="event"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Event
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="responsible_department"
                id="responsible_department"
                value={taskData.responsible_department}
                onChange={handleChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
              >
                <option value="" disabled>
                  Select Department
                </option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              <label
                htmlFor="responsible_department"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Responsible Department
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Edit
          </button>
        </form>
      </div>
    </>
  );
}

export default EditTask;