import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import "../styles/components.scss";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navigation />
      
      <div className="landing-content">
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            Welcome, {user?.email || 'User'}!
          </p>
        </div>

        {/* <h1>Volunteer Management Dashboard</h1>
        <p>Welcome to your volunteer management system</p> */}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
          padding: '1rem'
        }}>
          {/* Profile Management */}
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>👤 Profile Management</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Update your volunteer profile, skills, and availability
              </p>
            </div>
          </Link>

          {/* Event Management */}
          <Link to="/event-management" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>📅 Event Management</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Create and manage volunteer events
              </p>
            </div>
          </Link>

          {/* Volunteer Matching */}
          <Link to="/volunteer-matching" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>🤝 Volunteer Matching</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Match volunteers to events based on skills
              </p>
            </div>
          </Link>

          {/* Notifications */}
          <Link to="/notifications" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>🔔 Notifications</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                View your event assignments and updates
              </p>
            </div>
          </Link>

          {/* Volunteer History */}
          <Link to="/volunteer-history" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>📊 Volunteer History</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Track your volunteer participation and hours
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

