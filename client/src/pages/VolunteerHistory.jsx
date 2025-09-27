import React from "react";
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

export default function VolunteerHistory({ events = MOCK_EVENTS }) {
  return (
    <div className="volunteer-history-container">
      <h1 className="volunteer-history-header">Volunteer History</h1>

      <div className="volunteer-table-container">
        <table className="volunteer-table">
          <thead className="volunteer-table-header">
            <tr>
              <th>Event Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>Required Skills</th>
              <th>Urgency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="volunteer-empty-state">
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
        💡 <strong>Developer Note:</strong> This component displays volunteer history data. 
        Connect it to your backend by passing the <code>events</code> prop with real data.
      </div>
    </div>
  );
}
