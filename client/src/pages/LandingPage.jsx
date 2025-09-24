import React from "react";
import Banner from "./Banner";
import "../styles/components.scss";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div>
        <Banner />
      </div>
      <div className="landing-content">
        <h1>Volunteer Application</h1>
        <p>This is our landing page, yayyyyyyy</p>
      </div>
    </div>
  );
};

export default LandingPage;