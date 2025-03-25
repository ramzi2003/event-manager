import { Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";
import dataService from "../../../services/dataService";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Notification from "../../../layout/modals/Notification";

function CreateTask() {
  const [events, setEvents] = useState([]);
  const [department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    icon: null,
    bgColor: "",
    color: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await dataService.fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setNotification({
          show: true,
          message: "Error fetching events",
          icon: <FaExclamationCircle />,
          bgColor: "bg-red-100",
          color: "text-red-500",
        });
      }
    };

    const fetchDepartment = async () => {
      try {
        const fetchedDepartment = await dataService.fetchDepartments();
        setDepartment(fetchedDepartment);
      } catch (error) {
        console.error("Error fetching department:", error);
        setNotification({
          show: true,
          message: "Error fetching department",
          icon: <FaExclamationCircle />,
          bgColor: "bg-red-100",
          color: "text-red-500",
        });
      }
    };

    fetchDepartment();
    fetchEvents();
  }, []); // Add dependency array to run only once

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    const requiredFields = ["title", "event", "responsible_department"];
    const isEmpty = requiredFields.every((field) => !values[field]);

    if (isEmpty) {
      setNotification({
        show: true,
        message: "Please fill in all required fields",
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
      setLoading(false);
      setSubmitting(false);
      return;
    }

    try {
      const existingTask = await dataService.fetchTasks();
      const taskExists = existingTask.some(
        (task) => task.title === values.title
      );

      if (taskExists) {
        setNotification({
          show: true,
          message: "A task with this title already exists",
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
        setLoading(false);
      } else {
        const transformedValues = {
          ...values,
          event: parseInt(values.event, 10),
          responsible_department: parseInt(values.responsible_department, 10),
        };

        await dataService.createTask(transformedValues);
        setNotification({
          show: true,
          message: "Event created successfully!",
          icon: <FaCheckCircle />,
          bgColor: "bg-green-100",
          color: "text-green-500",
        });
        setTimeout(() => {
          setNotification({
            show: false,
            message: "",
            icon: null,
            bgColor: "",
            color: "",
          });
          setLoading(false);
          navigate("/view-tasks");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating task:", error);

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
        setTimeout(() => {
          setNotification({
            show: false,
            message: "",
            icon: null,
            bgColor: "",
            color: "",
          });
        }, 2000);
      }

      setLoading(false);
    }

    setSubmitting(false);
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
        className={`h-full overflow-y-scroll scroll-smooth no-scrollbar ${
          loading ? "pointer-events-none" : ""
        }`}
      >
        <div className="text-center mt-12">
          <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
            <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
            Create a New Task
          </div>
        </div>
        <Formik
          initialValues={{
            title: "",
            description: "",
            due_date: "",
            status: "",
            event: "",
            responsible_department: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mx-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    type="text"
                    name="title"
                    id="title"
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
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    rows="1"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer resize-none"
                    placeholder=" "
                  />
                  <label
                    htmlFor="description"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Description
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <div className="flex gap-4 items-center">
                    <label
                      htmlFor="due_date"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Due Date
                    </label>
                    <Field
                      type="datetime-local"
                      name="due_date"
                      id="due_date"
                      className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      required
                    />
                  </div>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    as="select"
                    name="status"
                    id="status"
                    required
                    className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Field>
                  <label
                    htmlFor="status"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Status
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    as="select"
                    name="event"
                    id="event"
                    className="cursor-pointer block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
                  </Field>
                  <label
                    htmlFor="event"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Event
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    as="select"
                    name="responsible_department"
                    id="responsible_department"
                    className="cursor-pointer block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    required
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    {department.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </Field>
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
                disabled={isSubmitting}
                className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Create
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default CreateTask;
