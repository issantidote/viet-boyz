import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from '../Profile/User/Navigation';
import './Notifications.css'

function Notifications() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null); // Define the user state
  const [notifs, setNotifs] = useState([]); // get the notification array

  // logout command
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/api/logout", {
        method: "POST",
        credentials: "include", 
      });
      localStorage.removeItem("user");
      localStorage.removeItem("adminId"); 
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchUserNotifs = async(uid) => {
    const response = await fetch(`http://localhost:5001/api/users/${uid}`);
    if (response.ok) {
      // get notifications for this user from the backend
      const userNotifs = await response.json();
      // proceed to set notifications to that. yippee!
      if(userNotifs.notifications.length > 0){
        const mappedNotifs = userNotifs.notifications.map((notif) => ({
          id: notif.NotifID,
          title: `${notif.NotifType} - ${notif.EventName}`,
          location: notif.EventLocation,
          urgency: notif.EventUrgency,
          date: new Date(notif.EventDate).toLocaleDateString(),
          type: notif.NotifType,
          name: notif.EventName
        }));
        setNotifs(mappedNotifs);
      }
      else{
        setNotifs([]) 
      }
    } 
    else {
      console.error("Failed to fetch user's notifications");
    }
  };

  const handleClearNotif = async(notifID) => {
    try{
      const updatedNotifs = notifs.filter((notif) => notif.id !== notifID);
      setNotifs(updatedNotifs);

      // should edit the notification
      const response = await fetch(`http://localhost:5001/api/notifs/${notifID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          new_notifs: updatedNotifs
        }),
      });

    }
    catch (error){
      console.error('Error clearing notification:', error);
    }
  };

  useEffect(() => {
    // Fetch user session 
    fetch('http://localhost:5001/api/profile', {
      method: 'GET',
      credentials: 'include', 
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Not authorized');
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        fetchUserNotifs(data.profileData.id);
      })
      .catch((error) => {
        console.error('Error fetching user notifications:', error);
        setUser(null); 
      });

  }, []);


  return (
    <div className="no-global-reset">
    <div className="root">
      <header className="notif_page">
      <Navbar />
       
        <h1>Notifications</h1>
        </header>

      <div className="notif_area">
        {notifs.length > 0 ? (
          notifs.map((notif) => {
            const type = notif.type.toLowerCase();
            return (
              <div key={notif.id || notif.notifID} className="notification">
                {type === 'assigned' && (
                  <>
                    <h3>Event Assignment</h3>
                    <p>You have been <strong>assigned</strong> to <strong>{notif.name}</strong>.</p>
                    <p><strong>Location: </strong>{notif.location}.</p>
                    <p><strong>Event Date:</strong> {notif.date}</p>
                  </>
                )}

                {type === 'removed' && (
                  <>
                    <h3>Event Removal</h3>
                    <p>You have been <strong>removed</strong> from <strong>{notif.name}</strong>.</p>
                    <p><strong>Location: </strong> {notif.location}.</p>
                  </>
                )}

                {type === 'cancelled' && (
                  <>
                    <h3>Event Cancellation</h3>
                    <p>The event <strong>{notif.name}</strong> at <strong>{notif.location}</strong> has been <strong>cancelled</strong>.</p>
                    <p><strong>Event Date:</strong> {notif.date}</p>
                  </>
                )}

                {type === '24HReminder' && (
                  <>
                    <h3>Event Reminder</h3>
                    <p>The event <strong>{notif.name}</strong> at <strong>{notif.location}</strong> that you have been assigned to is tomorrow!.</p>
                    <p><strong>Event Date:</strong> {notif.date}</p>
                  </>
                )}

                <button className="clear" onClick={() => handleClearNotif(notif.id)}>×</button>
              </div>
            );
          })
        ) : (
          <p><strong>No Notifications</strong></p>
        )}
      </div>

      
      
    </div>
    </div>
  )
}

export default Notifications