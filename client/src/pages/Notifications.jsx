import React, { useMemo, useState } from "react";
import Banner from "./Banner";
import "../styles/pages/notifications.scss";

const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "Assignment",
    title: "New Event Assignment",
    message: "You have been assigned to Food Bank Packing on Oct 5, 2025.",
    eventName: "Food Bank Packing",
    eventId: "e1",
    timestamp: "2025-09-25T10:30:00Z",
    read: false,
    priority: "High"
  },
  {
    id: "n2",
    type: "Update",
    title: "Event Updated",
    message: "Community Park Cleanup location changed to Buffalo Bayou Park East.",
    eventName: "Community Park Cleanup",
    eventId: "e2",
    timestamp: "2025-09-24T16:10:00Z",
    read: false,
    priority: "Medium"
  },
  {
    id: "n3",
    type: "Reminder",
    title: "Upcoming Event Reminder",
    message: "Coding for Kids Workshop starts tomorrow at 9:00 AM.",
    eventName: "Coding for Kids Workshop",
    eventId: "e3",
    timestamp: "2025-09-23T08:00:00Z",
    read: true,
    priority: "Low"
  },
  {
    id: "n4",
    type: "Assignment",
    title: "Shift Reassignment",
    message: "You have been reassigned to Disaster Relief Kit Build (afternoon shift).",
    eventName: "Disaster Relief Kit Build",
    eventId: "e4",
    timestamp: "2025-09-22T14:45:00Z",
    read: true,
    priority: "High"
  }
];

// filter options
const typeOptions = ["All", "Assignment", "Update", "Reminder"];
const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "unread", label: "Unread first" }
];

export default function Notifications() {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const [typeFilter, setTypeFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");

  const visibleItems = useMemo(() => {
    let data = [...items];

    // filter by ype
    if (typeFilter !== "All") {
      data = data.filter(n => n.type === typeFilter);
    }

    // serach notifications
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        (n.eventName || "").toLowerCase().includes(q)
      );
    }

    // filter by sort
    if (sort === "newest") {
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sort === "oldest") {
      data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (sort === "unread") {
      data.sort((a, b) => Number(a.read) - Number(b.read) || new Date(b.timestamp) - new Date(a.timestamp));
    }

    return data;
  }, [items, typeFilter, sort, query]);

  // checkings
  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const dismiss = (id) => {
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const viewEvent = (eventId) => {
    console.log("View event:", eventId);
    alert("not created yet!");
  };

  return (
    <div className="notifications-page">
      <Banner />

      <div className="notifications-hero">
        <h2>Notifications</h2>
        <p>Assignments, updates, and reminders for your events</p>
      </div>

      <div className="notifications-card">
        <div className="notifications-header">
          <div className="notifications-actions">
            <button className="btn btn-primary" onClick={markAllRead}>
              Mark all as read
            </button>
          </div>
        </div>

        <div className="notifications-controls">
          <div className="controls-left">
            <label className="control">
              <span>Type</span>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                {typeOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>

            <label className="control">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {sortOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="controls-right">
            <input
              type="text"
              placeholder="Search notifications..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {visibleItems.length === 0 ? (
          <div className="notifications-empty">
            No notifications match your filters.
          </div>
        ) : (
          <div className="notifications-grid">
            {visibleItems.map(n => (
              <div key={n.id} className={`notification-card ${n.read ? "is-read" : "is-unread"}`}>
                <div className="card-header">
                  <div className="meta">
                    <span className={`badge type-${n.type.toLowerCase()}`}>{n.type}</span>
                    <span className={`badge priority-${(n.priority || "Low").toLowerCase()}`}>{n.priority || "Low"}</span>
                    {!n.read && <span className="dot-unread" aria-label="unread"></span>}
                  </div>
                  <time className="timestamp">
                    {new Date(n.timestamp).toLocaleString()}
                  </time>
                </div>

                <div className="card-body">
                  <h3 className="title">{n.title}</h3>
                  <p className="message">{n.message}</p>
                  {n.eventName && (
                    <div className="event-pill">
                      <i className="bi bi-calendar-event"></i>
                      <span>{n.eventName}</span>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <div className="left">
                    <button className="btn btn-secondary" onClick={() => viewEvent(n.eventId)}>View Event</button>
                  </div>
                  <div className="right">
                    <button className="btn btn-ghost" onClick={() => toggleRead(n.id)}>
                      {n.read ? "Mark as unread" : "Mark as read"}
                    </button>
                    <button className="btn btn-danger" onClick={() => dismiss(n.id)}>Dismiss</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
          rel="stylesheet"
        />
      </div>
    </div>
  );
}