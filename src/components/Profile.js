import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    monthlyBookings: 0,
    totalSpent: 0
  });
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    console.log('Current user:', user);
    if (user?._id) {
      fetchUserData();
    }
  }, [user?._id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching data for user ID:', user._id);
      const response = await axios.get(`/api/users/${user._id}/stats`);
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setUserStats(response.data.stats);
        setUserDetails(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user information');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Unable to load profile information</p>
          <button
            onClick={fetchUserData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* User Profile Header */}
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {userDetails.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">{userDetails.name}</h1>
              <p className="text-gray-600">{userDetails.email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Total Bookings</h3>
              <p className="text-3xl font-bold text-blue-600">{userStats.totalBookings}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">This Month</h3>
              <p className="text-3xl font-bold text-blue-600">{userStats.monthlyBookings}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Total Spent</h3>
              <p className="text-3xl font-bold text-blue-600">${userStats.totalSpent}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                <p className="mt-2 text-lg font-medium p-3 bg-white rounded border">
                  {userDetails.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email Address</label>
                <p className="mt-2 text-lg font-medium p-3 bg-white rounded border">
                  {userDetails.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Member Since</label>
                <p className="mt-2 text-lg font-medium p-3 bg-white rounded border">
                  {new Date(userDetails.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Account Type</label>
                <p className="mt-2 text-lg font-medium p-3 bg-white rounded border">
                  {userDetails.role === 'admin' ? 'Administrator' : 'Regular Member'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate('/my-bookings')}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Bookings
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 