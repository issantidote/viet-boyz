import React from "react";
import { Link } from "react-router-dom";
import "../styles/components.scss";

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner_red">UH Student Event Planner</div>
      <nav className="banner_white">
        
        <Link to="/profile" className="banner_link">Profile</Link> {/* acceptable placeholder, but we'll want to move this elsewhere later */}
        <Link to="/volunteer-history" className="banner_link">Volunteer History</Link> {/* acceptable placeholder, but we'll want to move this elsewhere later */}
      </nav>
    </div>
  );
};

export default Banner;