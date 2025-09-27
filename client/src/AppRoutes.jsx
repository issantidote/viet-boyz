import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// add pages here:
import LandingPage from './pages/LandingPage';
import UserProfileManagement from './pages/UserProfileManagement';
import VolunteerHistory from './pages/VolunteerHistory';
import Notifications from "./pages/Notifications";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Add routes here */}
                <Route path='/' element={<LandingPage />} />
                <Route path='/profile' element={<UserProfileManagement />} />
                <Route path='/volunteer-history' element={<VolunteerHistory />} />
                <Route path='/notifications' element={<Notifications />} />
                {/* <Route path='/...' element={ <... /> }/> */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;