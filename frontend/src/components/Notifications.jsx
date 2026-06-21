import { useState, useEffect } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for notification events
    const handleNotification = (e) => {
      const newNotif = {
        id: Date.now(),
        message: e.detail.message,
        type: e.detail.type || "info",
      };
      setNotifications((prev) => [...prev, newNotif]);

      // Auto remove after 3 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== newNotif.id)
        );
      }, 3000);
    };

    window.addEventListener(
      "notification",
      handleNotification
    );
    return () =>
      window.removeEventListener(
        "notification",
        handleNotification
      );
  }, []);

  return (
    <div className="notifications-container">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`notification ${notif.type}`}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );
}

export default Notifications;