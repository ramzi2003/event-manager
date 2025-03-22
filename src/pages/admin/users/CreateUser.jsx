import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import dataService from "../../../services/dataService";
import { useNavigate } from "react-router-dom";
import Notification from "../../../layout/modals/Notification";

function CreateUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState([]);
  const [userType, setUserType] = useState([]);
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
    const fetchData = async () => {
      try {
        const departmentData = await dataService.fetchDepartments();
        setDepartment(departmentData);

        const userTypeData = await dataService.fetchUserTypes();
        const userTypeKeys = Object.keys(userTypeData);
        setUserType(userTypeKeys);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    const requiredFields = ["username", "password", "department"];
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
      const existingUser = await dataService.fetchUsers();
      const userExists = existingUser.some(
        (user) => user.username === values.username || user.email === values.email
      );

      if (userExists) {
        setNotification({
          show: true,
          message: "A user with this username  or email already exists",
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
          department: parseInt(values.department, 10),
          user_type: parseInt(values.user_type, 10),
        };

        await dataService.createUser(transformedValues);
        setNotification({
          show: true,
          message: "User created successfully!",
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
          navigate("/view-users");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating user:", error);

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
            Create a New Event
          </div>
        </div>
        <Formik
          initialValues={{
            username: "",
            password: "",
            email: "",
            first_name: "",
            last_name: "",
            department: "",
            user_type: "",
            is_admin: false,
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mx-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    pattern="^[\w.@+-]+$"
                    maxLength="150"
                    minLength="1"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="username"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Username
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    minLength="1"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="password"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Password
                  </label>
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </div>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    maxLength="254"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Email address
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    type="text"
                    name="first_name"
                    id="first_name"
                    maxLength="150"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="first_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    First Name
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    type="text"
                    name="last_name"
                    id="last_name"
                    maxLength="150"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="last_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Last Name
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    as="select"
                    name="department"
                    id="department"
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
                    htmlFor="department"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Responsible Department
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    as="select"
                    name="user_type"
                    id="user_type"
                    className="cursor-pointer block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    required
                  >
                    <option value="" disabled>
                      Select User Type
                    </option>
                    {userType.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Field>
                  <label
                    htmlFor="user_type"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    User Type
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group border-b-2 border-gray-300 focus-within:border-blue-600">
                  <div className="flex items-center py-2">
                    <Field
                      type="checkbox"
                      name="is_admin"
                      id="is_admin"
                      className="cursor-pointer w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded-sm focus:ring-blue-500"
                    />
                    <label
                      htmlFor="is_admin"
                      className="ml-2 text-sm text-gray-900"
                    >
                      Is Admin
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                disabled={isSubmitting}
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

export default CreateUser;
