import { Slide, toast } from "react-toastify";
import { FaBell } from "react-icons/fa";

export const showNotificationToast = (title: string, description: string) => {
  toast(
    ({ closeToast }) => (
      <div className="flex items-start gap-3">
        <div className="text-mainlilly mt-1">
          <FaBell size={22} />
        </div>
        <div className="flex-1">
          <strong className="block text-sm text-mainlilly">{title}</strong>
          <span className="text-gray-700 text-sm block">{description}</span>
        </div>
      </div>
    ),
    {
      position: "top-right",
      autoClose: 8000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      hideProgressBar: true,
      icon: false,
      theme: "light",
      transition: Slide,
    }
  );
};