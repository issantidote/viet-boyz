import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "./Banner";
import "./home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/isLoggedIn", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.loggedIn) {
          setUser(data.user);
          // Redirect to appropriate dashboard if logged in
          if (data.user.role === "Manager") {
            navigate("/admin");
          } else {
            navigate("/user");
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    
    checkLoginStatus();
  }, [navigate]);

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

export default Home;