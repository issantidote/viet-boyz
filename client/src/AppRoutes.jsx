import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// add pages here:
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import UserRegister from './pages/UserRegister'; 
import UserProfileManagement from './pages/UserProfileManagement';
import VolunteerHistory from './pages/VolunteerHistory';
import EventManagementNew from './pages/EventManagementNew';
import EventManagementUpdate from './pages/EventManagementUpdate';

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
                <Route path='/event-management' element={<EventManagementNew/>} />
                <Route path='/event-management/edit' element={<EventManagementUpdate/>} />
                {/* <Route path='/...' element={ <... /> }/> */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;