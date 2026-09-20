import { useState } from "react";
import { X, Clock, Eye, Edit2 } from "lucide-react";
import "./Reminders.css"

const initialReminders = [
//   {
//     id: 1,
//     level: "red",
//     emoji: "🔴",
//     title: "Budget Almost Exhausted",
//     description:
//       "Careful! This ₹1,200 purchase may push your monthly budget over the limit. You've used 90% of your ₹25,000 budget.",
//     type: "Budget Reminder",
//     buttons: ["Dismiss", "Snooze", "View Expense", "Change Budget"],
//   },

//   {
//     id: 2,
//     level: "yellow",
//     emoji: "🟡",
//     title: "Food Budget Warning",
//     description:
//       "You've spent 78% of your food budget. Only ₹440 remaining for the rest of the month.",
//     type: "Category Reminder",
//     buttons: ["Dismiss", "Snooze", "View Expense", "Change Budget"],
//   },

//   {
//     id: 3,
//     level: "green",
//     emoji: "🟢",
//     title: "Transport On Track",
//     description:
//       "₹350 spent on transport today. You're still within your weekly transport budget of ₹700.",
//     type: "Status Reminder",
//     buttons: ["Dismiss"],
//   },

//   {
//     id: 4,
//     level: "yellow",
//     emoji: "🟡",
//     title: "Unusual Spending Detected",
//     description:
//       "You spent 3× your average on shopping this week (₹5,600 vs ₹1,800 average).",
//     type: "Spending Reminder",
//     buttons: ["Dismiss", "View Expense"],
//   },

//   {
//     id: 5,
//     level: "red",
//     emoji: "🔴",
//     title: "Daily Spending Limit",
//     description:
//       "You've exceeded your daily spending limit of ₹1,500. Today's spend: ₹2,100.",
//     type: "Daily Reminder",
//     buttons: ["Dismiss", "Snooze", "Change Budget"],
//   },

//   {
//     id: 6,
//     level: "yellow",
//     emoji: "🟡",
//     title: "Upcoming Bill Due",
//     description:
//       "Your internet bill (₹999) is due in 3 days. Ensure sufficient balance.",
//     type: "Bill Reminder",
//     buttons: ["Dismiss", "Snooze"],
//   },

//   {
//     id: 7,
//     level: "green",
//     emoji: "🟢",
//     title: "Subscription Renewal",
//     description:
//       "Netflix (₹199) renews in 5 days. Review if you're still using it regularly.",
//     type: "Subscription Reminder",
//     buttons: ["Dismiss", "View Expense"],
//   },

//   {
//     id: 8,
//     level: "red",
//     emoji: "🔴",
//     title: "Low Remaining Balance",
//     description:
//       "Your remaining budget for September is only ₹2,550. Be mindful of upcoming expenses.",
//     type: "Balance Reminder",
//     buttons: ["Dismiss", "Snooze", "Change Budget"],
//   },
 ];

function Reminders() {
  const [reminders, setReminders] = useState(initialReminders);
  const [snoozedReminders, setSnoozedReminders] = useState([]);
  const [filter, setFilter] = useState("All");

  // Dismiss reminder
  const dismissReminder = (id) => {
    setReminders((oldReminders) =>
      oldReminders.filter((reminder) => reminder.id !== id)
    );
  };

  // Snooze reminder
  const snoozeReminder = (id) => {
    setSnoozedReminders((oldReminders) => [
      ...oldReminders,
      id,
    ]);

    setTimeout(() => {
      setSnoozedReminders((oldReminders) =>
        oldReminders.filter(
          (reminderId) => reminderId !== id
        )
      );
    }, 3000);
  };

  // Filter reminders
  const getFilteredReminders = () => {
    if (filter === "Critical") {
      return reminders.filter(
        (reminder) => reminder.level === "red"
      );
    }

    if (filter === "Warnings") {
      return reminders.filter(
        (reminder) => reminder.level === "yellow"
      );
    }

    if (filter === "Info") {
      return reminders.filter(
        (reminder) => reminder.level === "green"
      );
    }

    return reminders;
  };

  // Remove snoozed reminders from visible list
  const filteredReminders = getFilteredReminders().filter(
    (reminder) =>
      !snoozedReminders.includes(reminder.id)
  );

  // Count reminders
  const criticalCount = reminders.filter(
    (reminder) => reminder.level === "red"
  ).length;

  const warningCount = reminders.filter(
    (reminder) => reminder.level === "yellow"
  ).length;

  const infoCount = reminders.filter(
    (reminder) => reminder.level === "green"
  ).length;

  return (
    <div className="container-fluid px-3 px-md-4 py-4 reminders-page">

      {/* Page Header */}
      <div className="mb-4 fade-in">
        <h1 className="fw-bold page-title">
          Smart Reminders 🔔
        </h1>

        <p className="page-subtitle">
          Stay on top of your spending, bills and budgets
        </p>
      </div>


      {/* Reminder Statistics */}
      <div className="row g-3 mb-4">

        {/* Critical */}
        <div className="col-4">
          <div className="reminder-stat-card critical-card">

            <div className="reminder-stat-icon">
              🔴
            </div>

            <h2>
              {criticalCount}
            </h2>

            <p>
              Critical
            </p>

          </div>
        </div>


        {/* Warnings */}
        <div className="col-4">
          <div className="reminder-stat-card warning-card">

            <div className="reminder-stat-icon">
              🟡
            </div>

            <h2>
              {warningCount}
            </h2>

            <p>
              Warnings
            </p>

          </div>
        </div>


        {/* Notices */}
        <div className="col-4">
          <div className="reminder-stat-card info-card">

            <div className="reminder-stat-icon">
              🟢
            </div>

            <h2>
              {infoCount}
            </h2>

            <p>
              Notices
            </p>

          </div>
        </div>

      </div>


      {/* Filter Buttons */}
      <div className="d-flex flex-wrap gap-2 mb-4 fade-in-delay">

        <button
          className={`btn filter-btn ${
            filter === "All" ? "active-filter" : ""
          }`}
          onClick={() => setFilter("All")}
        >
          All
        </button>


        <button
          className={`btn filter-btn ${
            filter === "Critical"
              ? "active-filter"
              : ""
          }`}
          onClick={() => setFilter("Critical")}
        >
          🔴 Critical
        </button>


        <button
          className={`btn filter-btn ${
            filter === "Warnings"
              ? "active-filter"
              : ""
          }`}
          onClick={() => setFilter("Warnings")}
        >
          🟡 Warnings
        </button>


        <button
          className={`btn filter-btn ${
            filter === "Info"
              ? "active-filter"
              : ""
          }`}
          onClick={() => setFilter("Info")}
        >
          🟢 Info
        </button>

      </div>


      {/* Reminder List */}
      {filteredReminders.length === 0 ? (

        <div className="empty-reminder-box">

          <div className="empty-reminder-icon">
            😌
          </div>

          <h3>
            No reminders — You're doing great!
          </h3>

          <p>
            Nothing needs your attention right now.
          </p>

        </div>

      ) : (

        <div className="reminder-list">

          {filteredReminders.map((reminder) => (

            <div
              key={reminder.id}
              className={`spending-reminder ${reminder.level}-reminder reminder-item`}
            >

              {/* Reminder Icon */}
              <div className="reminder-emoji">
                {reminder.emoji}
              </div>


              {/* Reminder Content */}
              <div className="reminder-content">

                {/* Title */}
                <div className="reminder-heading">

                  <h3>
                    {reminder.title}
                  </h3>

                  <span className="reminder-type">
                    {reminder.type}
                  </span>

                </div>


                {/* Description */}
                <p className="reminder-description">
                  {reminder.description}
                </p>


                {/* Action Buttons */}
                <div className="reminder-actions">

                  {reminder.buttons.map((button) => {

                    /* Dismiss */
                    if (button === "Dismiss") {
                      return (
                        <button
                          key={button}
                          className="btn reminder-btn dismiss-btn"
                          onClick={() =>
                            dismissReminder(
                              reminder.id
                            )
                          }
                        >
                          {button}
                        </button>
                      );
                    }


                    /* Snooze */
                    if (button === "Snooze") {
                      return (
                        <button
                          key={button}
                          className="btn reminder-btn snooze-btn"
                          onClick={() =>
                            snoozeReminder(
                              reminder.id
                            )
                          }
                        >
                          <Clock size={13} />

                          Snooze
                        </button>
                      );
                    }


                    /* View Expense */
                    if (button === "View Expense") {
                      return (
                        <button
                          key={button}
                          className="btn reminder-btn"
                        >
                          <Eye size={13} />

                          View Expense
                        </button>
                      );
                    }


                    /* Change Budget */
                    if (button === "Change Budget") {
                      return (
                        <button
                          key={button}
                          className="btn reminder-btn"
                        >
                          <Edit2 size={13} />

                          Change Budget
                        </button>
                      );
                    }

                    return null;
                  })}

                </div>

              </div>


              {/* Close Button */}
              <button
                className="reminder-close"
                onClick={() =>
                  dismissReminder(reminder.id)
                }
              >
                <X size={17} />
              </button>

            </div>

          ))}

        </div>
      )}


      {/* Snooze Message */}
      {snoozedReminders.length > 0 && (

        <div className="snooze-message">

          💤 {snoozedReminders.length} reminder
          {snoozedReminders.length > 1
            ? "s"
            : ""}{" "}
          snoozed — will reappear in a moment

        </div>

      )}

    </div>
  );
}

export default Reminders;