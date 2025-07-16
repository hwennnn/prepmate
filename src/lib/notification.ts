import toast, { type ToastOptions } from "react-hot-toast";

export const notifyToaster = (
  success: boolean,
  msg: string,
  duration: number,
) => {
  const toastOptions = {
    duration: duration,
    position: "top-center",
    style: {
      padding: "0.5cm",
    },
  } as ToastOptions;
  if (success) {
    toast.success(msg, toastOptions);
  } else {
    toast.error(msg, toastOptions);
  }
};
