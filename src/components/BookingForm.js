import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeatSelection from './SeatSelection';
import Payment from './Payment';

const BookingForm = ({ movie }) => {
  const [selectedShowtime, setSelectedShowtime] = useState(movie.showtimes[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const booking = {
      seats: selectedSeats,
      totalAmount: selectedSeats.length * selectedShowtime.price,
      showtime: selectedShowtime
    };

    setBookingData(booking);
    setShowPayment(true);
    setLoading(false);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    navigate('/bookings');
  };

  if (showPayment) {
    return <Payment booking={bookingData} onSuccess={handlePaymentSuccess} />;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Book Tickets</h2>
      
      {/* Showtime Selection */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Select Showtime</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {movie.showtimes.map((showtime) => (
            <button
              key={showtime._id}
              onClick={() => setSelectedShowtime(showtime)}
              className={`p-2 rounded border ${
                selectedShowtime._id === showtime._id
                  ? 'bg-blue-600 text-white'
                  : 'border-gray-300 hover:border-blue-500'
              }`}
            >
              {new Date(showtime.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </button>
          ))}
        </div>
      </div>

      {/* Price Information */}
      <div className="mb-6">
        <p className="text-lg">
          Price per ticket: ${selectedShowtime.price.toFixed(2)}
        </p>
        {selectedSeats.length > 0 && (
          <p className="text-xl font-semibold">
            Total: ${(selectedSeats.length * selectedShowtime.price).toFixed(2)}
          </p>
        )}
      </div>

      {/* Seat Selection */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Select Seats</h3>
        <SeatSelection
          showtime={selectedShowtime}
          onSeatSelect={handleSeatSelect}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || selectedSeats.length === 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : `Book ${selectedSeats.length} Seats`}
      </button>
    </div>
  );
};

export default BookingForm; 