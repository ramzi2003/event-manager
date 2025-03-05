import PropTypes from 'prop-types';

const Notification = ({ text, icon }) => {
  return (
    <div className="fixed left-0 top-0 w-full flex justify-center z-[999]">
      <div
        id="toast-success"
        className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800"
        role="alert"
      >
        <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
          {icon}
          <span className="sr-only">Icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">
          {text}
        </div>
      </div>
    </div>
  );
};

Notification.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

export default Notification;