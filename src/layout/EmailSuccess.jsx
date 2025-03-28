import { useNavigate } from "react-router-dom";
import successIcon from "../assets/successIcon.png";

function EmailSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <img src={successIcon} className="w-40" />
      <h3 className="text-7xl font-bold text-slate-700 my-6">SUCCESS</h3>
      <p className="text-center px-4 w-1/2 text-slate-500">
        We&apos;ve sent a password reset link to your email. If you don&apos;t see it in
        your inbox, please check your spam or junk folder.
      </p>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mt-4 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer"
      >
        Back to Login
      </button>
    </div>
  );
}

export default EmailSuccess;