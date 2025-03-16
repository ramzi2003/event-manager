import { useState } from "react";

function EditEvent() {
  const [eventData] = useState({
    event_name: "",
    description: "",
    start_date: "",
    end_date: "",
    venue: "",
    importance: "",
    payment_status: "",
    gl_cc_info: "",
    purchase_requisition: "",
    accommodation: "",
  });

  return (
    <>
      <div className="h-full overflow-y-scroll scroll-smooth no-scrollbar">
        <div className="text-center mt-12">
          <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
            <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
            Create a New Event
          </div>
        </div>
        <form className="mx-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="event_name"
                id="event_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="event_name"
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
                  name="start_date"
                  id="start_date"
                  className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                />
                <span className="text-gray-500">-</span>
                <input
                  type="datetime-local"
                  name="end_date"
                  id="end_date"
                  className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                />
              </div>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="venue"
                id="venue"
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              >
                <option value="" disabled selected>
                  Select Venue
                </option>

                <option>Options</option>
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
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              >
                <option value="" disabled selected>
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
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              >
                <option value="" disabled selected>
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
                  className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded-sm focus:ring-blue-500"
                />
                <label
                  htmlFor="bordered-checkbox-2"
                  className="ml-2 text-sm  text-gray-900"
                >
                  Accommodation
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default EditEvent;
