import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dataService from "../../services/dataService"; // Import the dataService

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(false); // State to handle loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      await dataService.resetPasswordEmailLetter({ email }); // Call the API
      navigate("/forgot-password-success"); // Navigate to success page on success
    } catch (err) {
        console.log(err)
      setError("Failed to send reset email. Please try again."); // Handle error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <section className="bg-white md:bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg md:shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-6 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Reset Password Request
            </h2>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={handleSubmit} // Attach the submit handler
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p> // Display error message
              )}
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
                disabled={loading} // Disable button while loading
              >
                {loading ? "Sending..." : "Send Letter"} {/* Show loading state */}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;