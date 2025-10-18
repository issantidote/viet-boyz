import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Banner from "./Banner";
import "../styles/components.scss";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-page">
      <div>
        <Banner />
      </div>
      <div className="landing-content">
        <h1>Volunteer Management System</h1>
        <p style={{ fontSize: '1.2rem'}}>
          Welcome to our volunteer coordination platform. 
          Connect with opportunities and make a difference in your community.
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          marginTop: '2rem' 
        }}>
        </div>

        <div style={{ 
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          textAlign: 'left'
        }}>
          
        </div>
      </div>
    </div>
  );
};

export default LandingPage;