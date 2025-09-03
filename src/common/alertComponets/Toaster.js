import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let toastId = null; // Store the current toast ID
let previousMessage = ""; // Store the previous message
let previousType = ""; // Store the previous type

export const Toaster = (type, message) => {
  // Check if the new type and message are the same as the previous one
  if (type === previousType && message === previousMessage) {
    return; // Don't show the toast if it's the same
  }

  // If toast exists, update it with a new message and type
  if (toastId && toast.isActive(toastId)) {
    toast.update(toastId, {
      render: message,
      type: type,
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Zoom,
    });
  } else {
    // Create a new toast if no active one exists
    toastId = toast[type](message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Zoom,
      onClose: () => {
        toastId = null; // Reset toastId when toast is closed
        previousMessage = ""; // Reset previous message to allow re-showing
        previousType = ""; // Reset previous type
      },
    });
  }

  // Update the previous type and message
  previousType = type;
  previousMessage = message;
};
