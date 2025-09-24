import React from "react";
import { Link } from "react-router-dom";
import "../styles/components.scss";

const Banner = () => {
  return (
    <>
      {/* Red banner*/}
      <div className="banner_red">
        UH Student Event Planner
      </div>

      {/* White banner*/}
      <div className="banner_white">
        {/*Add white banner links here*/}
        <div>Home</div>
        <div>Events</div>
        <div>Login</div>
        <nav className="banner-nav">
          <Link to="/profile" className="banner-link">Profile</Link>
          <Link to="/volunteer-history" className="banner-link">Volunteer History</Link>
      </nav>
      </div>
    </>
  );
};

export default Banner;