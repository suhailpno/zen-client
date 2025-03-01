import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/my-bookings');
      setBookings(response.data.bookings || []); // Ensure it's an array
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;
  if (!bookings.length) return <div className="text-center py-8">No bookings found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex gap-6">
              <img
                src={booking.movie?.poster}
                alt={booking.movie?.title}
                className="w-32 h-48 object-cover rounded"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">{booking.movie?.title}</h3>
                <p className="text-gray-600">
                  Date: {new Date(booking.showtime).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Time: {new Date(booking.showtime).toLocaleTimeString()}
                </p>
                <p className="text-gray-600">
                  Seats: {booking.seats?.map(seat => `${seat.row}${seat.number}`).join(', ')}
                </p>
                <p className="text-gray-600">
                  Total Amount: ${booking.totalAmount}
                </p>
                <p className="text-gray-600">
                  Status: <span className="capitalize">{booking.status}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings; 