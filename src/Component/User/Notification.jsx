import { useState } from "react";
import { X } from "lucide-react";
import "./Notification.css"

const notificationsData = [
  {
    id: 1,
    // type: "red",
    // emoji: "🔴",
    // title: "Budget Alert: Food",
    // message:
    //   "You've used 98% of your food budget. Only ₹150 left for the rest of the month.",
    // time: "2 hours ago",
    // read: false,
  },
  {
    id: 2,
    // type: "green",
    // emoji: "🎉",
    // title: "Savings Milestone!",
    // message:
    //   "Congratulations! You've reached an important savings milestone.",
    // time: "5 hours ago",
    // read: false,
  },
  {
    id: 3,
    // type: "blue",
    // emoji: "📊",
    // title: "Monthly Report Ready",
    // message:
    //   "Your monthly expense report is ready to view.",
    // time: "1 day ago",
    // read: false,
  },
  {
    id: 4,
    // type: "yellow",
    // emoji: "📈",
    // title: "Expense Trend Alert",
    // message:
    //   "Your spending has increased compared to last month.",
    // time: "2 days ago",
    // read: true,
  },
  {
    id: 5,
//     type: "yellow",
//     emoji: "🔔",
//     title: "Bill Reminder",
//     message:
//       "Your upcoming bill is due soon. Don't forget to make the payment.",
//     time: "3 days ago",
//     read: true,
   },
  {
    id: 6,
    // type: "green",
    // emoji: "✅",
    // title: "Goal Progress",
    // message:
    //   "You have made progress towards your savings goal.",
    // time: "5 days ago",
    // read: true,
  },
];

function Notifications() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState("All");

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Mark all notifications as read
  const markAllRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    setNotifications(updatedNotifications);
  };

  // Mark one notification as read
  const markRead = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    );

    setNotifications(updatedNotifications);
  };

  // Delete notification
  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );

    setNotifications(updatedNotifications);
  };

  // Filter notifications
  const filteredNotifications =
    filter === "Unread"
      ? notifications.filter((notification) => !notification.read)
      : notifications;

  return (
    <div className="notifications-page container py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <div>
          <h1 className="notifications-title">
            Notifications 💬
          </h1>

          <p className="notifications-subtitle">
            {/* {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "All caught up! 🎉"} */}
          </p>
        </div>

        <div className="d-flex align-items-center gap-3">

          {/* Filter Buttons */}
          <div className="notification-filter">

            <button
              className={filter === "All" ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter("All")}
            >
              All
            </button>

            <button
              className={
                filter === "Unread"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setFilter("Unread")}
            >
              Unread

              {/* {unreadCount > 0 && (
                <span className="unread-count">
                  {unreadCount}
                </span>
              )} */}
            </button>

          </div>

          {/* Mark All Read */}
          {unreadCount > 0 && (
            <button
              className="mark-all-btn"
              onClick={markAllRead}
            >
              Mark all read
            </button>
          )}

        </div>
      </div>

      {/* Notifications List */}
      <div>

        {filteredNotifications.map((notification) => (

          <div
            key={notification.id}
            className={`notification-card ${notification.type} ${
              notification.read ? "read" : "unread"
            }`}
            onClick={() => markRead(notification.id)}
          >

            {/* Emoji */}
            <div className="notification-icon">
              {notification.emoji}
            </div>

            {/* Content */}
            <div className="notification-content">

              <div className="d-flex justify-content-between align-items-start">

                <div className="d-flex align-items-center gap-2">

                  <h5 className="notification-title">
                    {notification.title}
                  </h5>

                  {!notification.read && (
                    <span className="unread-dot"></span>
                  )}

                </div>

                {/* Delete Button */}
                <button
                  className="delete-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  <X size={16} />
                </button>

              </div>

              <p className="notification-message">
                {notification.message}
              </p>

              <p className="notification-time">
                {notification.time}
              </p>

            </div>

          </div>

        ))}

        {/* Empty State */}
        {filteredNotifications.length === 0 && (

          <div className="no-notifications">

            <div className="empty-emoji">
              😌
            </div>

            <h3>No alerts</h3>

            <p>
              You're doing great! Nothing needs your attention.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Notifications;