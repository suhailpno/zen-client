import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Payment from './Payment';

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  
  // Basic states that don't depend on other functions
  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [seatCategory, setSeatCategory] = useState('standard');
  const [showSummary, setShowSummary] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [bookingDetails, setBookingDetails] = useState({
    movie: {
      _id: movieId,
      title: '',
      poster: ''
    },
    date: '',
    time: '',
    seats: [],
    seatCategory: 'standard',
    totalAmount: 0
  });

  const getPricePerSeat = () => {
    if (!movie) return 0;
    return seatCategory === 'premium' ? movie.price.premium : movie.price.standard;
  };

  const calculateTotal = () => {
    const subtotal = selectedSeats.length * getPricePerSeat();
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  };

  // Fetch movie data
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`/api/movies/${movieId}`);
        setMovie(response.data);
      } catch (err) {
        setError('Failed to fetch movie details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  // Update booking details when relevant data changes
  useEffect(() => {
    if (movie) {
      setBookingDetails({
        movie: {
          _id: movieId,
          title: movie.title,
          poster: movie.poster
        },
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats,
        seatCategory: seatCategory,
        totalAmount: calculateTotal()
      });
    }
  }, [movie, selectedDate, selectedTime, selectedSeats, seatCategory, discount]);

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const showtimes = [
    '10:00 AM', '12:30 PM', '3:00 PM', 
    '6:30 PM', '9:00 PM', '11:30 PM'
  ];

  const handlePromoCode = async () => {
    try {
      const response = await axios.post('/api/bookings/validate-promo', {
        code: promoCode
      });
      setDiscount(response.data.discount);
    } catch (err) {
      console.error('Invalid promo code');
    }
  };

  const handleSeatConfirmation = () => {
    setStep(3);
  };

  const renderSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;

    return (
      <div className="overflow-x-auto">
        <div className="w-full max-w-3xl mx-auto p-6">
          <div className="mb-8 text-center">
            <div className="w-3/4 h-4 bg-gray-300 mx-auto mb-8 rounded">
              <div className="text-center text-sm text-gray-500">Screen</div>
            </div>
          </div>

          <div className="grid gap-4">
            {rows.map((row) => (
              <div key={row} className="flex justify-center gap-2">
                <div className="w-8 text-center font-semibold">{row}</div>
                {Array.from({ length: seatsPerRow }).map((_, index) => {
                  const seatId = `${row}${index + 1}`;
                  const isSelected = selectedSeats.includes(seatId);
                  const isPremium = row <= 'C'; // First 3 rows are premium

                  return (
                    <button
                      key={seatId}
                      disabled={seatCategory === 'standard' && isPremium}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSeats(selectedSeats.filter(id => id !== seatId));
                        } else {
                          setSelectedSeats([...selectedSeats, seatId]);
                        }
                      }}
                      className={`
                        w-8 h-8 rounded text-sm
                        ${isSelected ? 'bg-blue-600 text-white' : 
                          isPremium ? 'bg-purple-100 hover:bg-purple-200' : 
                          'bg-gray-100 hover:bg-gray-200'}
                        ${seatCategory === 'standard' && isPremium ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Movie</span>
            <span>{movie.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Date</span>
            <span>{new Date(selectedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Time</span>
            <span>{selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Seats ({selectedSeats.length})</span>
            <span>{selectedSeats.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span>Category</span>
            <span className="capitalize">{seatCategory}</span>
          </div>
          <div className="flex justify-between">
            <span>Price per seat</span>
            <span>${getPricePerSeat()}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${selectedSeats.length * getPricePerSeat()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${(selectedSeats.length * getPricePerSeat() * (discount / 100)).toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handlePromoCode}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Apply
            </button>
          </div>
        </div>

        <button
          onClick={handleSeatConfirmation}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          disabled={!selectedSeats.length}
        >
          Continue to Payment
        </button>
      </div>
    );
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!movie) return <div className="text-center py-8">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {step === 1 && (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = '/fallback-movie-poster.jpg';
              }}
            />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="font-semibold">{movie.rating?.imdb?.toFixed(1) || 'N/A'}</span>
            </div>
            <p className="text-gray-600 mb-4">{movie.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-semibold">Duration:</p>
                <p>{movie.duration}</p>
              </div>
              <div>
                <p className="font-semibold">Language:</p>
                <p>{movie.language}</p>
              </div>
              <div>
                <p className="font-semibold">Genre:</p>
                <p>{movie.genre.join(', ')}</p>
              </div>
              <div>
                <p className="font-semibold">Director:</p>
                <p>{movie.director}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Select Date</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getAvailableDates().map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date.toISOString())}
                    className={`px-4 py-2 rounded whitespace-nowrap ${
                      selectedDate === date.toISOString()
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Select Time</h3>
                <div className="grid grid-cols-3 gap-2">
                  {showtimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Continue to Seat Selection
              </button>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {renderSeats()}
          </div>
          <div>
            {renderSummary()}
          </div>
        </div>
      )}

      {step === 3 && (
        <Payment
          booking={bookingDetails}
          onSuccess={() => {
            navigate('/my-bookings');
          }}
        />
      )}
    </div>
  );
};

export default BookingPage; 