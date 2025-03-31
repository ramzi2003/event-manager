import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dataService from "../../../services/dataService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

function EditEvent() {
  const { eventId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [initialEventData, setInitialEventData] = useState({});
  const [isNonInteractive, setIsNonInteractive] = useState(false);
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    venue: "",
    importance: "",
    payment_status: "",
    gl_cc_info: "",
    purchase_requisition: "",
    accommodation: false,
  });
  const [venues, setVenues] = useState([]);
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
    const fetchEventData = async () => {
      try {
        const [event, venuesData] = await Promise.all([
          dataService.fetchEventById(eventId),
          dataService.fetchVenues(),
        ]);
        const formattedEvent = {
          ...event,
          start_date: formatDate(event.start_date),
          end_date: formatDate(event.end_date),
        };
        setEventData(formattedEvent);
        setInitialEventData(formattedEvent); // Store the initial event data
        setVenues(venuesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event data:", error);
        setError(
          "Event not found or an error occurred while fetching the event data."
        );
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "start_date", "end_date", "venue"];
    const isEmpty = requiredFields.every((field) => !eventData[field]);

    if (isEmpty) {
      toast.error("The form is empty. Please fill in the required fields.");
      return;
    }

    // Check if there are any changes
    const hasChanges = Object.keys(eventData).some(
      (key) => eventData[key] !== initialEventData[key]
    );

    if (!hasChanges) {
      navigate("/view-events");
      return;
    }

    try {
      const existingEvents = await dataService.fetchEvents();
      const eventExists = existingEvents.some(
        (event) => event.name === eventData.name && event.id !== eventId
      );

      if (eventExists && eventData.name !== initialEventData.name) {
        toast.error("An event with the same name already exists");
        setEventData((prevData) => ({
          ...prevData,
          name: initialEventData.name, // Revert to the initial name
        }));
      } else {
        const transformedValues = {
          ...eventData,
          venue: parseInt(eventData.venue, 10),
        };

        // Log the request data
        console.log("Request data:", transformedValues);

        await dataService.updateEvent(eventId, transformedValues);
        toast.success("Event updated successfully");
        setIsNonInteractive(true); // Make the page non-interactive
        setIsNonInteractive(false); // Restore interactivity
        navigate("/view-events"); // Redirect to /view-events
      }
    } catch (error) {
      console.error("Error updating event:", error);

      // Log detailed error information
      if (error.response && error.response.data) {
        toast.error(error.response?.data?.message || "Something went wrong. Try again later");
      }
    }
  };

  return (
    <>
      <div
        className={`h-full overflow-y-scroll scroll-smooth no-scrollbar${
          isNonInteractive ? " pointer-events-none" : ""
        }`}
      >
        <div className="text-center mt-12">
          <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
            <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
            Edit Event
          </div>
        </div>
        <form className="mx-auto" onSubmit={handleSubmit} autoComplete="off">
          <div className="grid grid-cols-2 gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="name"
                id="name"
                value={eventData.name}
                onChange={handleChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Event Name
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <textarea
                name="description"
                id="description"
                rows="1"
                value={eventData.description}
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
            {isMobile ? (
              <>
               <div className="relative z-0 w-full mb-5 group">
               <input
                  type="datetime-local"
                  name="start_date"
                  id="start_date"
                  value={eventData.start_date}
                  onChange={handleChange}
                  className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                />
               </div>
               <div className="relative z-0 w-full mb-5 group">
               <input
                  type="datetime-local"
                  name="end_date"
                  id="end_date"
                  value={eventData.end_date}
                  onChange={handleChange}
                  className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                />
               </div>
              </>
            ) : (
              <>
              <div className="relative z-0 w-full mb-5 group">
              <div className="flex gap-4 items-center">
                <input
                  type="datetime-local"
                  name="start_date"
                  id="start_date"
                  value={eventData.start_date}
                  onChange={handleChange}
                  className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                />
                <span className="text-gray-500">-</span>
                <input
                  type="datetime-local"
                  name="end_date"
                  id="end_date"
                  value={eventData.end_date}
                  onChange={handleChange}
                  className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                />
              </div>
              </div>
              </>
            )}
           

            <div className="relative z-0 w-full mb-5 group">
              <select
                name="venue"
                id="venue"
                value={eventData.venue}
                onChange={handleChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              >
                <option value="" disabled>
                  Select Venue
                </option>
                {venues &&
                  venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name}
                    </option>
                  ))}
              </select>
              <label
                htmlFor="venue"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Venue
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="importance"
                id="importance"
                value={eventData.importance}
                onChange={handleChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              >
                <option value="" disabled>
                  Select Importance
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <label
                htmlFor="importance"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Importance
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="payment_status"
                id="payment_status"
                value={eventData.payment_status}
                onChange={handleChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              >
                <option value="" disabled>
                  Select Payment Status
                </option>
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="close">Close</option>
              </select>
              <label
                htmlFor="payment_status"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Payment Status
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="gl_cc_info"
                id="gl_cc_info"
                value={eventData.gl_cc_info}
                onChange={handleChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="gl_cc_info"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                GL/CC Information
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="purchase_requisition"
                id="purchase_requisition"
                value={eventData.purchase_requisition}
                onChange={handleChange}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="purchase_requisition"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Purchase Requisition
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group border-b-2 border-gray-300 focus-within:border-blue-600">
              <div className="flex items-center py-2">
                <input
                  id="bordered-checkbox-2"
                  type="checkbox"
                  name="accommodation"
                  checked={eventData.accommodation}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded-sm focus:ring-blue-500"
                />
                <label
                  htmlFor="bordered-checkbox-2"
                  className="ml-2 text-sm text-gray-900"
                >
                  Accommodation
                </label>
              </div>
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

export default EditEvent;