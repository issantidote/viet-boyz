import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// add pages here:
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import UserRegister from './pages/UserRegister'; 
import UserProfileManagement from './pages/UserProfileManagement';
import VolunteerHistory from './pages/VolunteerHistory';
import Notifications from "./pages/Notifications";
import EventManagementNew from './pages/EventManagementNew';
import EventManagementUpdate from './pages/EventManagementUpdate';
import VolunteerMatching from './pages/VolunteerMatching';


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Add routes here */}
                <Route path='/' element={<LandingPage />} />
                <Route path='/login' element={<LoginPage/>} />
                <Route path='/user-register' element={<UserRegister/>} />
                <Route path='/profile' element={<UserProfileManagement />} />
                <Route path='/volunteer-history' element={<VolunteerHistory />} />
                <Route path='/notifications' element={<Notifications />} />
                <Route path='/event-management' element={<EventManagementNew/>} />
                <Route path='/event-management/edit' element={<EventManagementUpdate/>} />
                <Route path='/volunteer-matching' element={<VolunteerMatching/>} />
                {/* <Route path='/...' element={ <... /> }/> */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;