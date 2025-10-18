import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import UserRegister from './pages/UserRegister';

// Protected pages
import Dashboard from './pages/Dashboard';
import UserProfileManagement from './pages/UserProfileManagement';
import VolunteerHistory from './pages/VolunteerHistory';
import Notifications from "./pages/Notifications";
import EventManagementNew from './pages/EventManagementNew';
import EventManagementUpdate from './pages/EventManagementUpdate';
import VolunteerMatching from './pages/VolunteerMatching';


const AppRoutes = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/user-register' element={<UserRegister />} />

                    {/* Protected Routes */}
                    <Route 
                        path='/dashboard' 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path='/profile' 
                        element={
                            <ProtectedRoute>
                                <UserProfileManagement />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path='/volunteer-history' 
                        element={
                            <ProtectedRoute>
                                <VolunteerHistory />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path='/notifications' 
                        element={
                            <ProtectedRoute>
                                <Notifications />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path='/event-management' 
                        element={
                            <ProtectedRoute>
                                <EventManagementNew />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path='/event-management/edit' 
                        element={
                            <ProtectedRoute>
                                <EventManagementUpdate />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path='/volunteer-matching' 
                        element={
                            <ProtectedRoute>
                                <VolunteerMatching />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Catch all - redirect to landing */}
                    <Route path='*' element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;