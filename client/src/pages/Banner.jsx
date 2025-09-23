import React from "react";
import { Link } from "react-router-dom";
import "../styles/components.scss";

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-title">UH Student Event Planner</div>
      <nav className="banner-nav">
        <Link to="/profile" className="banner-link">Profile</Link>
      </nav>
    </div>
  );
};

export default Banner;