import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bookings/my-bookings');
      setBookings(response.data.bookings);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (bookingId) => {
    try {
      const response = await axios.post(`/api/bookings/${bookingId}/refund`);
      if (response.data.success) {
        // Refresh bookings after successful refund
        fetchBookings();
        alert('Refund processed successfully');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process refund');
    }
  };

  const isRefundEligible = (showtime) => {
    const now = new Date();
    const showDateTime = new Date(showtime);
    const hoursUntilShow = (showDateTime - now) / (1000 * 60 * 60);
    return hoursUntilShow > 2; // Refund available if more than 2 hours before show
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{booking.movie.title}</h2>
                      <p className="text-gray-600">
                        {new Date(booking.showtime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${booking.totalAmount.toFixed(2)}
                      </p>
                      <p className={`text-sm ${
                        booking.status === 'confirmed' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-600">Seats: {booking.seats.map(seat => seat.row + seat.number).join(', ')}</p>
                    <p className="text-gray-600">Booking Reference: {booking.bookingReference}</p>
                  </div>

                  {booking.status === 'confirmed' && isRefundEligible(booking.showtime) && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleRefund(booking._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Request Refund
                      </button>
                      <p className="mt-2 text-sm text-gray-500">
                        * Refunds are available up to 2 hours before the show time
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings; 