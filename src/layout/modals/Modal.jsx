import PropTypes from "prop-types";

function Modal({
  isOpen,
  onClose,
  title,
  message,
  color,
  bgColor,
  icon: Icon,
  onConfirm,
}) {
  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-30 backdrop-blur-md"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white m-4 p-6 w-full max-w-md md:max-w-lg lg:max-w-xl rounded-xl shadow-lg transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center space-x-3">
          {Icon && <Icon className={`h-7 w-7 ${color}`} />}
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>

        {/* Message */}
        <p className="mt-4 text-gray-700">{message}</p>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 py-2 px-5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 focus:ring focus:ring-gray-200 active:bg-gray-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`${bgColor} rounded-md bg-blue-600 py-2 px-5 text-sm font-medium text-white transition-all shadow-md  hover:shadow-lg focus:ring cursor-pointer`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  onConfirm: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
};

export default Modal;
