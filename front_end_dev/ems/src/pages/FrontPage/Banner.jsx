import React from "react";
import { Link } from "react-router-dom";
import "./Banner.css";

const Banner = () => {
  return (
    <>
      {/* Red banner */}
      <div className="banner_red">
        UH Student Event Planner
      </div>

      {/* White banner */}
      <div className="banner_white">
        <div>
          <Link to="/" className="banner-link">Home</Link>
        </div>
        <div>
          <Link to="/login" className="banner-link">Login</Link>
        </div>
        <div>
          <Link to="/donate" className="banner-link">Donate</Link>
        </div>
        {/* <div>
          <Link to="/profile" className="banner-link">Profile</Link>
        </div>
        <div>
          <Link to="/volunteer-history" className="banner-link">Volunteer History</Link>
        </div>
        <div>
          
          <Link to="/event-management" className="banner-link">Create an Event</Link>
        </div>
        <div>
          
          <Link to="/event-management/edit" className="banner-link">Edit an Event</Link>
        </div>
        <div>

          <Link to="/volunteer-matching" className="banner-link">Match Volunteers</Link>
        </div> */}
      </div>
    </>
  );
};

export default Banner;
