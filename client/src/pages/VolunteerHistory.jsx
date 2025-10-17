import React, { useState, useEffect } from "react";
import { listVolunteerHistory } from "../services/volunteerHistoryApi.js";
import "../styles/components.scss";


/** @typedef {Object} EventItem
 *  @property {string} name              // Event Name (100 chars)
 *  @property {string} description       // Event Description (textarea)
 *  @property {string} location          // Location (textarea)
 *  @property {string[]} requiredSkills  // Required Skills (multi-select)
 *  @property {"High"|"Medium"|"Low"} urgency // Urgency (dropdown)
 *  @property {"Started"|"Not Start"|"Done"} status // Volunteer Participation Status
 */

/** @type {EventItem[]} */
const MOCK_EVENTS = [
  {
    name: "Food Bank Packing",
    description: "Pack and sort canned goods for distribution.",
    location: "Houston Food Bank Warehouse",
    requiredSkills: ["Lifting", "Teamwork"],
    urgency: "High",
    status: "Started",
  },
  {
    name: "Community Park Cleanup",
    description: "Trash pickup and light landscaping.",
    location: "Buffalo Bayou Park",
    requiredSkills: ["Outdoor", "Gardening"],
    urgency: "Medium",
    status: "Not Start",
  },
  {
    name: "Coding for Kids Workshop",
    description: "Teach Scratch to 4th–5th graders.",
    location: "Montrose Library — Room B",
    requiredSkills: ["Teaching", "Python", "Public Speaking"],
    urgency: "Low",
    status: "Done",
  },
  {
    name: "Disaster Relief Kit Build",
    description: "Assemble emergency kits for families in need.",
    location: "UH Student Center South",
    requiredSkills: ["Packing", "Organization"],
    urgency: "High",
    status: "Started",
  },
];

const getUrgencyClass = (urgency) => {
  switch (urgency) {
    case "High":
      return "volunteer-urgency-high";
    case "Medium":
      return "volunteer-urgency-medium";
    case "Low":
      return "volunteer-urgency-low";
    default:
      return "volunteer-urgency-default";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Started":
      return "volunteer-status-started";
    case "Not Started":
      return "volunteer-status-not-started";
    case "Done":
      return "volunteer-status-done";
    default:
      return "volunteer-status-default";
  }
};

// Helper function to format date and time
const formatDateTime = (isoString) => {
  if (!isoString) return 'Not specified';
  
  try {
    const date = new Date(isoString);
    const dateOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    const timeOptions = { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    };
    
    const dateStr = date.toLocaleDateString('en-US', dateOptions);
    const timeStr = date.toLocaleTimeString('en-US', timeOptions);
    
    return `${dateStr} at ${timeStr}`;
  } catch (error) {
    return 'Invalid date';
  }
};

export default function VolunteerHistory() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState('default-user'); // Default user for demo

  const fetchVolunteerHistory = async (userId = currentUser) => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Log the API URL being used
      console.log('Fetching from API URL:', import.meta.env.VITE_API_URL || 'http://localhost:4000');
      console.log('Full API endpoint:', `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/volunteer-history`);
      console.log('For user:', userId);
      
      const response = await listVolunteerHistory({ userId });
      console.log('API Response:', response);
      setEvents(response.items || []);
    } catch (err) {
      console.error('Failed to fetch volunteer history:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(err.message || 'Failed to load volunteer history');
      // Fallback to mock data if API fails
      setEvents(MOCK_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteerHistory();
  }, [currentUser]);

  const handleUserChange = (e) => {
    setCurrentUser(e.target.value);
  };

  if (loading) {
    return (
      <div className="volunteer-history-container">
        <h1 className="volunteer-history-header">Volunteer History</h1>
        <div className="volunteer-loading">
          <p>Loading volunteer history...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="volunteer-history-container">
      <h1 className="volunteer-history-header">Volunteer History</h1>

      {/* User Selector for Demo */}
      <div className="volunteer-user-selector">
        <label htmlFor="user-select">
          <strong>👤 View history for user:</strong>
        </label>
        <select 
          id="user-select" 
          value={currentUser} 
          onChange={handleUserChange}
          className="volunteer-user-dropdown"
        >
          <option value="default-user">Default User</option>
          <option value="user-123">User 123 (John)</option>
          <option value="user-456">User 456 (Sarah)</option>
          <option value="user-789">User 789 (Mike - no history)</option>
        </select>
      </div>

      <div className="volunteer-table-container">
        <table className="volunteer-table">
          <thead className="volunteer-table-header">
            <tr>
              <th>Event Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>Required Skills</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Urgency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={8} className="volunteer-empty-state">
                  No volunteer history yet. Start volunteering to see your activities here!
                </td>
              </tr>
            ) : (
              events.map((event, idx) => (
                <tr key={idx}>
                  <td className="volunteer-event-name">
                    {event.name}
                  </td>
                  <td className="volunteer-description">
                    {event.description}
                  </td>
                  <td className="volunteer-location">
                    {event.location}
                  </td>
                  <td>
                    <div className="volunteer-skills-container">
                      {(event.requiredSkills || []).map((skill) => (
                        <span key={skill} className="volunteer-skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="volunteer-time-cell">
                    {formatDateTime(event.startTime)}
                  </td>
                  <td className="volunteer-time-cell">
                    {formatDateTime(event.endTime)}
                  </td>
                  <td>
                    <span className={`volunteer-badge ${getUrgencyClass(event.urgency)}`}>
                      {event.urgency}
                    </span>
                  </td>
                  <td>
                    <span className={`volunteer-badge ${getStatusClass(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="volunteer-developer-note">
        {error && (
          <div className="volunteer-error-message">
            ⚠️ <strong>API Error:</strong> {error}. Showing fallback data.
          </div>
        )}
        💡 <strong>Developer Note:</strong> This component now fetches real data from the backend API at /api/volunteer-history.
        {events.length > 0 && (
          <div className="volunteer-data-info">
            📊 Showing {events.length} volunteer history {events.length === 1 ? 'event' : 'events'}.
          </div>
        )}
      </div>
    </div>
  );
}
