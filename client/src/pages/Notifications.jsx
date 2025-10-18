import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import * as notificationsApi from "../services/notificationsApi";
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
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");

  // Fetch notifications from backend
  useEffect(() => {
    async function fetchNotifications() {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError("");
        const data = await notificationsApi.listNotifications({ 
          userId: user.id 
        });
        setItems(data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError(err.message || "Failed to load notifications");
        // Fallback to mock data if backend fails
        setItems(MOCK_NOTIFICATIONS);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [user]);

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
  const markAllRead = async () => {
    try {
      // Mark all unread notifications as read
      const unread = items.filter(n => !n.read);
      await Promise.all(unread.map(n => notificationsApi.markAsRead(n.id)));
      setItems(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      alert("Failed to mark all notifications as read");
    }
  };

  const toggleRead = async (id) => {
    const notification = items.find(n => n.id === id);
    if (!notification) return;

    try {
      if (!notification.read) {
        await notificationsApi.markAsRead(id);
      }
      setItems(prev => prev.map(n => (n.id === id ? { ...n, read: !n.read } : n)));
    } catch (err) {
      console.error("Failed to toggle read status:", err);
      alert("Failed to update notification status");
    }
  };

  const dismiss = async (id) => {
    try {
      await notificationsApi.dismissNotification(id);
      setItems(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to dismiss notification:", err);
      alert("Failed to dismiss notification");
    }
  };

  const viewEvent = (eventId) => {
    console.log("View event:", eventId);
    alert("not created yet!");
  };

  return (
    <div className="notifications-page">
      <Navigation />

      <div className="notifications-hero">
        <h2>Notifications</h2>
        <p>Assignments, updates, and reminders for your events</p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading notifications...</p>
        </div>
      )}

      {error && (
        <div style={{ 
          padding: '1rem', 
          margin: '1rem', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffc107',
          borderRadius: '4px',
          color: '#856404'
        }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && (
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
      )}
    </div>
  );
}