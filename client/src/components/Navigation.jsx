import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/components.scss";

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Red banner */}
      <div className="banner_red">
        UH Student Event Planner
      </div>

      {/* White banner with dynamic links */}
      <div className="banner_white">
        {!isAuthenticated ? (
          // Public navigation (not logged in)
          <>
            <div>
              <Link to="/" className="banner-link">Home</Link>
            </div>
            <div>
              <Link to="/login" className="banner-link">Login</Link>
            </div>
          </>
        ) : (
          // Protected navigation (logged in)
          <>
            <div>
              <Link to="/dashboard" className="banner-link">Home</Link>
            </div>
            <div>
              <Link to="/profile" className="banner-link">Profile</Link>
            </div>
            <div>
              <Link to="/event-management" className="banner-link">Events</Link>
            </div>
            <div>
              <Link to="/volunteer-matching" className="banner-link">Match Volunteers</Link>
            </div>
            <div>
              <Link to="/volunteer-history" className="banner-link">Volunteer History</Link>
            </div>
            <div>
              <Link to="/notifications" className="banner-link">Notifications</Link>
            </div>
            <div>
              <button 
                onClick={handleLogout}
                className="banner-link"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit'
                }}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Navigation;

