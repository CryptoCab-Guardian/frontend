import { toast } from 'react-toastify';

export const NotificationService = {
  showToast() {
    toast.info(
      <div>
        <h4 className="font-bold">New Ride Request! 🚗</h4>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );

  },

  showSystemNotification() {
    if (Notification.permission === 'granted') {
      new Notification('New Ride Request!');
    }
  }
};