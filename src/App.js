import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MovieSearch from './components/MovieSearch';
import BookingPage from './components/BookingPage';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Bookings from './components/Bookings';
import PayPalProvider from './components/PayPalProvider';
import Profile from './components/Profile';
import ForgotPassword from './components/ForgotPassword';
import ErrorBoundary from './components/ErrorBoundary';
import MyBookings from './components/MyBookings';
// import Home from './components/Home';



function App() {
  return (
    <AuthProvider>
      <PayPalProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><MovieSearch /></PrivateRoute>} />
                <Route path="/booking/:movieId" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
                <Route path="/bookings" element={
                  <PrivateRoute>
                    <ErrorBoundary>
                      <Bookings />
                    </ErrorBoundary>
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
              </Routes>
            </div>
          </div>
        </Router>
      </PayPalProvider>
    </AuthProvider>
  );
}

export default App; 