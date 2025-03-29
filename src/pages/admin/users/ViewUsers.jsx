import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import dataService from "../../../services/dataService";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Modal from "../../../layout/modals/Modal";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewUsers = () => {
  const [departments, setDepartments] = useState([]);
  const [userType, setUserType] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedUserType, setSelectedUserType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const usersPerPage = 5;
  const navigate = useNavigate();

  const currentUserId = useSelector((state) => state.auth.user.id);

  const handleDeleteUser = async () => {
    try {
      await dataService.deleteUser(userToDelete);
      setUsers(users.filter((user) => user.id !== userToDelete));

      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again later"
      );
    } finally {
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentsData = await dataService.fetchDepartments();
        setDepartments(departmentsData);
        console.log(departmentsData);

        const userTypesData = await dataService.fetchUserTypes();
        const userTypeKeys = Object.keys(userTypesData);
        setUserType(userTypeKeys);

        const usersData = await dataService.fetchUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
        console.log(usersData);
        console.log(filteredUsers);
      } catch (error) {
        console.error("Error fetching departments and user types:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [selectedDepartment, selectedUserType, searchQuery, users]);

  useEffect(() => {
    updateDisplayedUsers();
  }, [filteredUsers, currentPage]);

  const filterUsers = () => {
    let filtered = users;
    console.log(selectedDepartment);
    if (selectedDepartment !== "All") {
      filtered = filtered.filter(
        (user) => user.department === selectedDepartment
      );
    }

    if (selectedUserType !== "All") {
      filtered = filtered.filter((user) => user.user_type === selectedUserType);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const updateDisplayedUsers = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const toggleDropdown = (event, eventId) => {
    event.stopPropagation();
    setOpenDropdownId(openDropdownId === eventId ? null : eventId);
  };

  const handleClickOutside = (event) => {
    if (
      openDropdownId &&
      !event.target.closest(`#dropdown-${openDropdownId}`)
    ) {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    if (openDropdownId) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdownId]);

  const handleNextPage = () => {
    if (currentPage * usersPerPage < filteredUsers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openDeleteModal = (userId) => {
    if (userId === currentUserId) {
      toast.error("You cannot delete yourself");
      return;
    }

    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : "Unknown";
  };

  const displayedUsers = updateDisplayedUsers();

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        color="text-red-500"
        bgColor="bg-red-500"
        icon={RiDeleteBin6Fill}
        onConfirm={handleDeleteUser}
      />
      <div className="border-b pb-3 border-gray-300">
        <div className="relative">
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
            placeholder="Search by username, full name, or email"
            className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {[
              {
                label: "Department",
                options: ["All", ...departments.map((dept) => dept.name)],
                value:
                  selectedDepartment === "All"
                    ? "All"
                    : departments.find((dept) => dept.id === selectedDepartment)
                        ?.name,
                onChange: (e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue === "All") {
                    setSelectedDepartment("All");
                  } else {
                    const selectedDept = departments.find(
                      (dept) => dept.name === selectedValue
                    );
                    setSelectedDepartment(
                      selectedDept ? selectedDept.id : "All"
                    );
                  }
                },
              },
              {
                label: "User Type",
                options: ["All", ...userType],
                value: selectedUserType,
                onChange: (e) => setSelectedUserType(e.target.value),
              },
            ].map((filter, index) => (
              <div key={index} className="relative">
                <select
                  className="cursor-pointer block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  value={filter.value}
                  onChange={filter.onChange}
                >
                  {filter.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
                  {filter.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-3/4 overflow-y-auto w-full">
        <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <table className="w-full text-left table-auto ">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    Username
                  </p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    Full Name
                  </p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    Email
                  </p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    Department
                  </p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    User Type
                  </p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50 w-1/10"></th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <tr
                  className="hover:bg-slate-50 border-b border-slate-200"
                  key={user.id}
                >
                  <td className="p-4 py-5">
                    <p className="block font-semibold text-sm text-slate-800">
                      {user.username}
                    </p>
                  </td>
                  <td className="p-4 py-5">
                    <p className="text-sm text-slate-500">
                      {user.first_name} {user.last_name}
                    </p>
                  </td>
                  <td className="p-4 py-5">
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </td>
                  <td className="p-4 py-5">
                    <p className="text-sm text-slate-500">
                      {getDepartmentName(user.department)}
                    </p>
                  </td>
                  <td className="p-4 py-5">
                    <p className="text-sm text-slate-500">{user.user_type}</p>
                  </td>

                  <td className="p-4 py-5">
                    <div className="w-16">
                      <div className="relative text-right">
                        <button
                          className="hover:bg-gray-200 p-1 rounded-md cursor-pointer align-top"
                          onClick={(e) => toggleDropdown(e, user.id)}
                        >
                          <IoEllipsisHorizontalSharp />
                        </button>
                        {openDropdownId === user.id && (
                          <div
                            id={`dropdown-${user.id}`}
                            className="absolute right-0 mt-2 w-44 bg-white rounded divide-y divide-gray-100 shadow z-10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ul className="py-1 text-sm text-gray-700">
                              <li>
                                <button
                                  type="button"
                                  data-modal-target="updateProductModal"
                                  data-modal-toggle="updateProductModal"
                                  className="flex w-full items-center py-2 px-4 hover:bg-gray-100 text-blue-500 cursor-pointer"
                                  onClick={() =>
                                    navigate(`/edit-user/${user.id}`)
                                  }
                                >
                                  <FaEdit className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  data-modal-target="deleteModal"
                                  data-modal-toggle="deleteModal"
                                  className="flex w-full items-center py-2 px-4 hover:bg-gray-100 text-red-500 cursor-pointer"
                                  onClick={() => openDeleteModal(user.id)}
                                >
                                  <RiDeleteBin6Fill className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center px-4 py-3">
            <div className="text-sm text-slate-500">
              Showing{" "}
              <b>
                {(currentPage - 1) * usersPerPage + 1}-
                {Math.min(currentPage * usersPerPage, filteredUsers.length)}
              </b>{" "}
              of {filteredUsers.length}
            </div>
            <div className="flex space-x-1">
              {currentPage > 1 && (
                <button
                  className="px-3 cursor-pointer py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
                  onClick={handlePrevPage}
                >
                  Prev
                </button>
              )}
              <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-white bg-slate-800 border border-slate-800 rounded hover:bg-slate-600 hover:border-slate-600 transition duration-200 ease">
                {currentPage}
              </button>
              {currentPage * usersPerPage < filteredUsers.length && (
                <button
                  className="px-3 cursor-pointer py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
                  onClick={handleNextPage}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewUsers;
