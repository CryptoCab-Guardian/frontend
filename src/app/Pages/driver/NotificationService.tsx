import { toast } from 'react-toastify';
import { Order } from './types';

export const NotificationService = {
  showToast(ride: Order) {
    toast.info(
      <div>
        <h4 className="font-bold">New Ride Request! 🚗</h4>
        <p className="text-sm mt-1">From: {ride.pickupAddress}</p>
        <p className="text-sm">To: {ride.dropAddress}</p>
        <p className="text-sm font-semibold text-green-600 mt-1">{ride.price}</p>
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

    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(console.error);
  },

  showSystemNotification(ride: Order) {
    if (Notification.permission === 'granted') {
      new Notification('New Ride Request!', {
        body: `From: ${ride.pickupAddress}\nTo: ${ride.dropAddress}`,
        icon: '/favicon.ico'
      });
    }
  }
};