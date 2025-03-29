import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../../store/authSlice";
import { useNavigate } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, message, user } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(login({ username, password, rememberMe }));
  };
  
  useEffect(() => {
    if (user || isError) {
      setLoading(false);
    }
    if (user) {
      navigate("/dashboard");
    }
    if (isError) {
      let errorMessage = "Invalid username or password"; // Default to this for login failures
      
      // Debugging - log the full error structure
      console.log('Full error object:', message);
      
      // Handle Axios error structure from Django REST framework
      if (message?.isAxiosError) {
        const responseData = message.response?.data;
        
        // Handle Django REST framework's error formats
        if (typeof responseData === 'object') {
          if (responseData.detail) {
            // Case 1: Simple detail message
            errorMessage = responseData.detail;
          } else if (responseData.non_field_errors) {
            // Case 2: Non-field errors array
            errorMessage = responseData.non_field_errors[0];
          } else if (responseData.username) {
            // Case 3: Username-specific errors
            errorMessage = responseData.username[0];
          } else if (responseData.password) {
            // Case 4: Password-specific errors
            errorMessage = responseData.password[0];
          }
        }
      }
      // Handle network errors
      else if (message?.message?.includes('Network Error')) {
        errorMessage = "Network error - Please check your internet connection";
      }
  
      toast.error(errorMessage);
      dispatch(reset());
    }
  }, [user, isError, message, navigate, dispatch]);
  

  return (
    <div>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center select-none">
                Sign In
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} autoComplete="off">
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 select-none"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    placeholder="User"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 select-none"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 cursor-pointer"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3 text-sm cursor-pointer">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300 cursor-pointer select-none"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <Link
                    to={"/forgot-password"}
                    className="text-sm font-medium text-blue-600 hover:underline cursor-pointer select-none"
                  >
                    Forgot password
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 select-none focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  {loading ? (
                    <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-4 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                  ) : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;