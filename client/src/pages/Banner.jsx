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
        <div>
          <Link to="/login" className="banner-link">Login</Link>
        </div>
        <div>
          <Link to="/profile" className="banner-link">Profile</Link>
        </div>
        <div>
          <Link to="/volunteer-history" className="banner-link">Volunteer History</Link>
        </div>
      </div>
    </>
  );
};

export default Banner;