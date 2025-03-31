import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import dataService from "../../../services/dataService";
import Modal from "../../../layout/modals/Modal";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const ViewEvents = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedImportance, setSelectedImportance] = useState("all");
  const [glCc, setGlCc] = useState("");
  const [searchName, setSearchName] = useState("");
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const accordionContent = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, venuesData] = await Promise.all([
          dataService.fetchEvents(),
          dataService.fetchVenues(),
        ]);
        setEvents(eventsData);
        setVenues(venuesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleImportanceChange = (event) => {
    setSelectedImportance(event.target.value);
  };

  const handleGlCcChange = (event) => {
    setGlCc(event.target.value);
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const toggleAccordion = (eventId) => {
    setOpenAccordionId(openAccordionId === eventId ? null : eventId);
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

  const getVenueName = (venueId) => {
    const venue = venues.find((v) => v.id === venueId);
    return venue ? venue.name : "Unknown Venue";
  };

  const handleDeleteEvent = async () => {
    try {
      await dataService.deleteEvent(eventToDelete);
      setEvents(events.filter((event) => event.id !== eventToDelete));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.response?.data?.message || "Failed to delete event");
    } finally {
      setIsModalOpen(false);
      setEventToDelete(null);
    }
  };

  const openDeleteModal = (eventId) => {
    setEventToDelete(eventId);
    setIsModalOpen(true);
  };

  const filteredEvents = events
    .filter((event) => {
      const eventEndDate = new Date(event.end_date);
      return (
        (!selectedMonth ||
          (eventEndDate.getMonth() === selectedMonth.getMonth() &&
            eventEndDate.getFullYear() === selectedMonth.getFullYear())) &&
        (selectedStatus === "all" ||
          event.payment_status === selectedStatus.replace(/_/g, " ")) &&
        (selectedImportance === "all" ||
          event.importance === selectedImportance) &&
        (glCc === "" || event.gl_cc_info.includes(glCc)) &&
        (searchName === "" ||
          event.name.toLowerCase().includes(searchName.toLowerCase()))
      );
    })
    .sort((a, b) => new Date(a.end_date) - new Date(b.end_date));

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
        onConfirm={handleDeleteEvent}
      />
      <div className="pb-3">
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
            placeholder="Search name"
            value={searchName}
            onChange={handleSearchNameChange}
            className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {[
              {
                label: "Importance",
                options: ["All", "Low", "Medium", "High"],
              },
              {
                label: "Payment Status",
                options: ["All", "Open", "In Progress", "Close"],
              },
            ].map((filter, index) => (
              <div key={index} className="relative">
                <select
                  className=" cursor-pointer block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  onChange={
                    filter.label === "Importance"
                      ? handleImportanceChange
                      : handleStatusChange
                  }
                >
                  {filter.options.map((option, i) => (
                    <option
                      key={i}
                      value={option.toLowerCase().replace(/\s/g, "_")}
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
                GL & CC
              </label>
              <input
                type="text"
                value={glCc}
                onChange={handleGlCcChange}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              />
            </div>
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
                className="cursor-pointer block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="h-3/4 overflow-y-auto">
        <ul
          role="list"
          className="border border-gray-200 rounded-lg divide-y divide-gray-200"
        >
          {filteredEvents.map((event) => (
            <li
              key={event.id}
              className={`border-l-4 ${
                event.importance === "low"
                  ? "border-l-blue-500"
                  : event.importance === "medium"
                  ? "border-l-yellow-300"
                  : "border-l-red-400"
              } cursor-pointer`}
              onClick={() => toggleAccordion(event.id)}
            >
              <div>
                <div className="pt-2 px-2">
                  <div className="flex flex-row justify-between">
                    <div>
                      <p>
                        <span className="text-lg font-semibold">
                          {event.name}
                        </span>
                      </p>
                      <p>
                        <span className="text-sm font-normal leading-none text-gray-400">
                          {new Date(event.start_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}{" "}
                          -{" "}
                          {new Date(event.end_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </span>
                      </p>
                      <p className="text-sm italic">
                        {getVenueName(event.venue)}
                      </p>
                    </div>
                    <div className="w-16">
                      <div className="relative text-right">
                        <button
                          className="hover:bg-gray-200 p-1 rounded-md cursor-pointer align-top"
                          onClick={(e) => toggleDropdown(e, event.id)}
                        >
                          <IoEllipsisHorizontalSharp />
                        </button>
                        {openDropdownId === event.id && (
                          <div
                            id={`dropdown-${event.id}`}
                            className="absolute right-0 mt-2 w-44 bg-white rounded divide-y divide-gray-100 shadow z-10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ul className="py-1 text-sm text-gray-700">
                              <li>
                                <button
                                  type="button"
                                  data-modal-target="updateProductModal"
                                  data-modal-toggle="updateProductModal"
                                  className="flex w-full items-center py-2 px-4 hover:bg-gray-100 text-blue-500  cursor-pointer"
                                  onClick={() =>
                                    navigate(`/edit-event/${event.id}`)
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
                                  onClick={() => openDeleteModal(event.id)} // Open delete modal
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
                  </div>
                  <div className="text-gray-700 my-4">{event.description}</div>
                </div>
                <div
                  ref={accordionContent}
                  style={{
                    maxHeight:
                      openAccordionId === event.id && accordionContent.current
                        ? `${accordionContent.current.scrollHeight + 50}px`
                        : "0px",
                  }}
                  className="overflow-hidden transition-max-height duration-150 ease-in-out"
                >
                  <div className="bg-gray-50 py-2 px-2">
                    <p>
                      <span className="font-semibold">Accommodation:</span>{" "}
                      {event.accommodation ? "Yes" : "No"}
                    </p>
                    <p className="capitalize">
                      <span className="font-semibold">Payment Status:</span>{" "}
                      {event.payment_status}
                    </p>
                    <p>
                      <span className="font-semibold">GL & CC:</span>{" "}
                      {event.gl_cc_info}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Purchase Requisition:
                      </span>{" "}
                      {event.purchase_requisition}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ViewEvents;
