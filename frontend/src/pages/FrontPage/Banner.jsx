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
      </div>
    </>
  );
};

export default Banner;
