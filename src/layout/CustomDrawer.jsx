import { useState, useEffect } from "react";
import Modal from "./modals/Modal";
import { MdDeleteOutline, MdDelete } from "react-icons/md";
import { RiEditLine, RiEditFill } from "react-icons/ri";
import Drawer from "react-modern-drawer";
import { GoDotFill } from "react-icons/go";
import "react-modern-drawer/dist/index.css";
import dataService from "../services/dataService";
import PropTypes from "prop-types";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CustomDrawer = ({
  isOpen,
  setIsOpen,
  selectedEvent,
  isHovered,
  setIsHovered,
  isHoverSecondary,
  setIsHoverSecondary,
  getImportanceClasses,
  tasks,
  user,
  refreshEvents, // Receive the refresh function as a prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venuesData = await dataService.fetchVenues();
        setVenues(venuesData);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, []);

  const getVenueName = (venueId) => {
    const venue = venues.find((v) => v.id === venueId);
    return venue ? venue.name : "Unknown Venue";
  };
  const handleDeleteEvent = async () => {
    setIsModalOpen(false);
    setIsLoading(true);
    
    try {
      await dataService.deleteEvent(selectedEvent.id);
      toast.success("Event deleted successfully");
      
      // Check if refreshEvents exists and is a function before calling it
      if (typeof refreshEvents === 'function') {
        refreshEvents();
      } else {
        console.warn('refreshEvents is not a function');
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.response?.data?.message || "Failed to delete event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        direction="right"
        className="p-6 bg-white overflow-hidden"
        style={{ width: "40%" }}
      >
        <div>
          <span
            className={`absolute flex items-center justify-center w-[100vw] h-[100vh] ${
              getImportanceClasses(selectedEvent.importance).bgClass
            } rounded-full -top-40 -left-10 -z-10 ring-4 ring-white`}
          >
            <svg
              aria-hidden="true"
              className={`w-48 h-48 absolute top-0 left-0 ${
                getImportanceClasses(selectedEvent.importance).textClass
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ filter: "blur(4px)" }}
            ></svg>
          </span>
          <div className="px-6 py-8 mx-auto bg-white mt-10 rounded-lg h-[calc(100vh-20px)]">
            <div className="text-right flex justify-end items-center">
              {user.is_admin && (
                <>
                  <span
                    className="cursor-pointer text-blue-300 hover:text-blue-600 mr-4"
                    onMouseOver={() => setIsHoverSecondary(true)}
                    onMouseOut={() => setIsHoverSecondary(false)}
                    onClickCapture={() => navigate(`/edit-event/${selectedEvent.id}`)}
                  >
                    {isHoverSecondary ? <RiEditFill /> : <RiEditLine />}
                  </span>
                  <span
                    className="cursor-pointer text-red-300 hover:text-red-600"
                    onMouseOver={() => setIsHovered(true)}
                    onMouseOut={() => setIsHovered(false)}
                    onClick={() => {
                      setIsOpen(false);
                      setIsModalOpen(true);
                    }}
                  >
                    {isHovered ? <MdDelete /> : <MdDeleteOutline />}
                  </span>
                </>
              )}
            </div>

            <h1 className="font-bold text-2xl my-4 text-center text-blue-600">
              {selectedEvent.name}
            </h1>
            <hr className="mb-2" />
            <div className="overflow-y-auto h-[calc(100vh-200px)] no-scrollbar">
              <div className="flex justify-between mb-6">
                <h1 className="text-lg font-bold">Description</h1>
                <div className="text-gray-700 ml-12 text-justify">
                  <div>{selectedEvent.description}</div>
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4">Details</h2>
                <div className="text-gray-700 mb-2">
                  Start Date:{" "}
                  {new Date(selectedEvent.start_date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
                <div className="text-gray-700 mb-2">
                  Due Date:{" "}
                  {new Date(selectedEvent.end_date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>

                <div className="text-gray-700 mb-2">
                  {getVenueName(selectedEvent.venue)}
                </div>
              </div>
              <table className="w-full mb-8">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="text-left text-gray-700">Accommodation</td>
                    <td className="text-right text-gray-700">
                      {selectedEvent.accommodation ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="text-left text-gray-700">GL CC</td>
                    <td className="text-right text-gray-700">
                      {selectedEvent.gl_cc_info}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="text-left text-gray-700">Payment Status:</td>
                    <td className="text-right text-gray-700">
                      {selectedEvent.payment_status.charAt(0).toUpperCase() +
                        selectedEvent.payment_status.slice(1)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="text-left text-gray-700">
                      Purchase Requisition
                    </td>
                    <td className="text-right text-gray-700">
                      {selectedEvent.purchase_requisition}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="text-left text-gray-700">Task</td>
                    <td className="text-right text-gray-700 py-2">
                      {tasks.map((task) => (
                        <span
                          key={task.id}
                          className="border border-gray-300 rounded-xl px-3 font-semibold text-sm inline-flex items-center"
                        >
                          <GoDotFill className="mr-2 text-blue-600" />
                          {task.title}
                        </span>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Drawer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        onConfirm={handleDeleteEvent}
        icon={ArchiveBoxXMarkIcon}
        color="text-red-500"
        bgColor="bg-red-400 hover:bg-red-500"
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      )}
    </>
  );
};

CustomDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  selectedEvent: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    venue: PropTypes.string,
    accommodation: PropTypes.bool,
    gl_cc_info: PropTypes.string,
    payment_status: PropTypes.string,
    purchase_requisition: PropTypes.string,
    importance: PropTypes.string,
  }).isRequired,
  isHovered: PropTypes.bool.isRequired,
  setIsHovered: PropTypes.func.isRequired,
  isHoverSecondary: PropTypes.bool.isRequired,
  setIsHoverSecondary: PropTypes.func.isRequired,
  getImportanceClasses: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  user: PropTypes.shape({
    is_admin: PropTypes.bool.isRequired,
  }).isRequired,
  refreshEvents: PropTypes.func.isRequired,
};

export default CustomDrawer;