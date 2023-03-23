import { toast } from "react-toastify";

export function toastError(message) {
  toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}

export function toastSuccess(message, callback) {
  toast.success(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    onClose: callback,
  });
}

export function toastPromise(Promise, message1, message2, message3) {
  toast.promise(Promise, {
    pending: message1,
    success: message2,
    error: message3,
  });
}
