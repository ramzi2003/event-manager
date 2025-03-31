import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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

function CreateEvent() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const fetchedVenues = await dataService.fetchVenues();
        setVenues(fetchedVenues);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    const requiredFields = ["name", "start_date", "end_date", "venue"];
    const isEmpty = requiredFields.every((field) => !values[field]);

    if (isEmpty) {
      toast.error("The form is empty. Please fill in the required fields.");
      setLoading(false);
      setSubmitting(false);
      return;
    }

    try {
      const existingEvents = await dataService.fetchEvents();
      const eventExists = existingEvents.some(
        (event) => event.name === values.name
      );

      if (eventExists) {
        toast.error("An event with the same name already exists");
        setLoading(false);
      } else {
        const transformedValues = {
          ...values,
          venue: parseInt(values.venue, 10),
        };

        // Log the request data
        console.log("Request data:", transformedValues);

        await dataService.createEvent(transformedValues);
        toast.success("Event created successfully");
        setLoading(false);
        navigate("/view-events");
      }
    } catch (error) {
      console.error("Error creating event:", error);

      // Log detailed error information
      if (error.response && error.response.data) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Try again later"
        );
      }

      setLoading(false);
    }
    setSubmitting(false);
  };

  return (
    <>
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
            room: "",
            comment: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mx-auto" autoComplete="off">
              <div className="grid grid-cols-2 gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    type="text"
                    name="name"
                    id="name"
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
                {isMobile ? (
                  <>
                    <div className="relative z-0 w-full mb-5 group">
                      <Field
                        type="datetime-local"
                        name="start_date"
                        id="start_date"
                        className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        required
                      />
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <Field
                        type="datetime-local"
                        name="end_date"
                        id="end_date"
                        className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative z-0 w-full mb-5 group">
                      <div className="flex gap-4 items-center">
                        <Field
                          type="datetime-local"
                          name="start_date"
                          id="start_date"
                          className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          required
                        />
                        <span className="text-gray-500">-</span>
                        <Field
                          type="datetime-local"
                          name="end_date"
                          id="end_date"
                          className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    as="select"
                    name="venue"
                    id="venue"
                    className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    required
                  >
                    <option value="" disabled>
                      Select Venue
                    </option>
                    {venues.map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name}
                      </option>
                    ))}
                  </Field>
                  <label
                    htmlFor="venue"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Venue
                  </label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    as="select"
                    name="importance"
                    id="importance"
                    required
                    className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value="" disabled>
                      Select Importance
                    </option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Field>
                  <label
                    htmlFor="importance"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Importance
                  </label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    as="select"
                    name="payment_status"
                    id="payment_status"
                    required
                    className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value="" disabled>
                      Select Payment Status
                    </option>
                    <option value="open">Open</option>
                    <option value="in progress">In Progress</option>
                    <option value="close">Close</option>
                  </Field>
                  <label
                    htmlFor="payment_status"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Payment Status
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    type="text"
                    name="gl_cc_info"
                    id="gl_cc_info"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="gl_cc_info"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    GL/CC
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <Field
                    type="text"
                    name="purchase_requisition"
                    id="purchase_requisition"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
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
                    <Field
                      type="checkbox"
                      name="accommodation"
                      id="accommodation"
                      className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded-sm focus:ring-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor="accommodation"
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

export default CreateEvent;
