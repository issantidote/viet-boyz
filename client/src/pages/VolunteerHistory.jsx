import React from "react";
import "../styles/colors.scss";


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

const getUrgencyStyle = (urgency) => {
  switch (urgency) {
    case "High":
      return { backgroundColor: "rgb(200, 16, 46)", color: "white" }; // primary-red
    case "Medium":
      return { backgroundColor: "rgb(246, 190, 0)", color: "rgb(100, 8, 23)" }; // gold with chocolate text
    case "Low":
      return { backgroundColor: "rgb(0, 179, 136)", color: "white" }; // teal
    default:
      return { backgroundColor: "rgb(136, 139, 141)", color: "white" }; // custom-gray
  }
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Started":
      return { backgroundColor: "rgb(150, 12, 34)", color: "white" }; // brick
    case "Not Start":
      return { backgroundColor: "rgb(84, 88, 90)", color: "white" }; // slate
    case "Done":
      return { backgroundColor: "rgb(0, 134, 108)", color: "white" }; // custom-green
    default:
      return { backgroundColor: "rgb(136, 139, 141)", color: "white" }; // custom-gray
  }
};

export default function VolunteerHistory({ events = MOCK_EVENTS }) {
  const volunteerHistoryStyles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "Arial, sans-serif"
    },
    header: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: "rgb(200, 16, 46)", // primary-red
      marginBottom: "2rem",
      textAlign: "center",
      borderBottom: `3px solid rgb(246, 190, 0)`, // gold
      paddingBottom: "1rem"
    },
    tableContainer: {
      backgroundColor: "rgb(255, 249, 217)", // cream
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      overflow: "auto"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
    },
    tableHeader: {
      backgroundColor: "rgb(84, 88, 90)", // slate
      color: "white"
    },
    th: {
      padding: "1rem",
      textAlign: "left",
      fontWeight: "600",
      fontSize: "0.95rem",
      borderBottom: "2px solid rgb(200, 16, 46)" // primary-red
    },
    tr: {
      borderBottom: "1px solid rgb(136, 139, 141)" // custom-gray
    },
    trHover: {
      backgroundColor: "rgb(255, 249, 217)" // cream on hover
    },
    td: {
      padding: "1rem",
      verticalAlign: "top"
    },
    eventName: {
      fontWeight: "600",
      color: "rgb(100, 8, 23)", // chocolate
      fontSize: "1.1rem"
    },
    description: {
      maxWidth: "300px",
      lineHeight: "1.4",
      color: "rgb(84, 88, 90)" // slate
    },
    location: {
      color: "rgb(150, 12, 34)", // brick
      fontWeight: "500"
    },
    skillsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem"
    },
    skillBadge: {
      backgroundColor: "rgb(0, 89, 80)", // forest
      color: "white",
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "500"
    },
    badge: {
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "600",
      textAlign: "center",
      minWidth: "100px",
      whiteSpace: "nowrap",
      display: "inline-block"
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      color: "rgb(136, 139, 141)", // custom-gray
      fontSize: "1.2rem",
      fontStyle: "italic"
    }
  };

  return (
    <div style={volunteerHistoryStyles.container}>
      <h1 style={volunteerHistoryStyles.header}>Volunteer History</h1>

      <div style={volunteerHistoryStyles.tableContainer}>
        <table style={volunteerHistoryStyles.table}>
          <thead style={volunteerHistoryStyles.tableHeader}>
            <tr>
              <th style={volunteerHistoryStyles.th}>Event Name</th>
              <th style={volunteerHistoryStyles.th}>Description</th>
              <th style={volunteerHistoryStyles.th}>Location</th>
              <th style={volunteerHistoryStyles.th}>Required Skills</th>
              <th style={volunteerHistoryStyles.th}>Urgency</th>
              <th style={volunteerHistoryStyles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} style={volunteerHistoryStyles.emptyState}>
                  No volunteer history yet. Start volunteering to see your activities here!
                </td>
              </tr>
            ) : (
              events.map((event, idx) => (
                <tr 
                  key={idx} 
                  style={volunteerHistoryStyles.tr}
                  onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = "rgb(255, 249, 217)"}
                  onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = "white"}
                >
                  <td style={{...volunteerHistoryStyles.td, ...volunteerHistoryStyles.eventName}}>
                    {event.name}
                  </td>
                  <td style={{...volunteerHistoryStyles.td, ...volunteerHistoryStyles.description}}>
                    {event.description}
                  </td>
                  <td style={{...volunteerHistoryStyles.td, ...volunteerHistoryStyles.location}}>
                    {event.location}
                  </td>
                  <td style={volunteerHistoryStyles.td}>
                    <div style={volunteerHistoryStyles.skillsContainer}>
                      {(event.requiredSkills || []).map((skill) => (
                        <span key={skill} style={volunteerHistoryStyles.skillBadge}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={volunteerHistoryStyles.td}>
                    <span style={{...volunteerHistoryStyles.badge, ...getUrgencyStyle(event.urgency)}}>
                      {event.urgency}
                    </span>
                  </td>
                  <td style={volunteerHistoryStyles.td}>
                    <span style={{...volunteerHistoryStyles.badge, ...getStatusStyle(event.status)}}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: "2rem",
        padding: "1rem",
        backgroundColor: "rgb(255, 249, 217)", // cream
        borderRadius: "8px",
        border: `2px solid rgb(246, 190, 0)`, // gold
        fontSize: "0.9rem",
        color: "rgb(100, 8, 23)" // chocolate
      }}>
        💡 <strong>Developer Note:</strong> This component displays volunteer history data. 
        Connect it to your backend by passing the <code>events</code> prop with real data.
      </div>
    </div>
  );
}
