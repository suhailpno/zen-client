import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const CreditCardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const PayPalIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .632-.539h6.012c2.071 0 3.728.553 4.919 1.644 1.191 1.09 1.776 2.62 1.776 4.571 0 1.098-.219 2.176-.656 3.227-.437 1.052-1.07 1.976-1.892 2.771-.823.795-1.822 1.421-2.996 1.875-1.175.454-2.497.682-3.967.682H6.204l-.87 3.37a.642.642 0 0 1-.633.516h-2.25l.625-2.5z"/>
  </svg>
);

const Payment = ({ booking }) => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const navigate = useNavigate();

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCardIcon />,
      color: 'bg-blue-500'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <PayPalIcon />,
      color: 'bg-[#003087]'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 18l6.708 3.354a1 1 0 00.578.158H19a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12z" />
      </svg>,
      color: 'bg-gray-800'
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>,
      color: 'bg-black'
    }
  ];

  const simulatePaymentProcess = async () => {
    setProcessingStep('Initiating payment...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProcessingStep('Verifying payment details...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProcessingStep('Processing transaction...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProcessingStep('Confirming booking...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handlePayment = async () => {
    try {
      if (!user) {
        throw new Error('Please login to continue');
      }

      setLoading(true);
      await simulatePaymentProcess();

      // Format the date and time properly
      const [hours, minutes, period] = booking.time.match(/(\d+):(\d+)\s*(AM|PM)/).slice(1);
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      const showDateTime = new Date(booking.date);
      showDateTime.setHours(hour);
      showDateTime.setMinutes(parseInt(minutes));

      const bookingData = {
        movieId: booking.movie._id,
        showtime: showDateTime.toISOString(),
        seats: booking.seats.map(seat => ({
          row: seat.charAt(0),
          number: parseInt(seat.slice(1)),
          category: booking.seatCategory
        })),
        totalAmount: booking.totalAmount,
        paymentMethod: selectedMethod,
        paymentDetails: selectedMethod === 'card' ? {
          cardNumber: paymentDetails.cardNumber.slice(-4),
          cardHolder: paymentDetails.name
        } : {}
      };

      console.log('Sending booking data:', bookingData);
      const response = await axios.post('/api/bookings', bookingData);

      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/my-bookings');
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Holder Name
              </label>
              <input
                type="text"
                placeholder="Name on card"
                className="w-full p-2 border rounded"
                value={paymentDetails.name}
                onChange={(e) => setPaymentDetails({...paymentDetails, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border rounded"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-2 border rounded"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength="3"
                  className="w-full p-2 border rounded"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 'paypal':
        return (
          <div className="mt-6 text-center">
            <button
              onClick={handlePayment}
              className="w-full bg-[#003087] text-white py-3 rounded font-semibold hover:bg-[#002D74]"
            >
              Pay with PayPal
            </button>
          </div>
        );
      case 'googlepay':
      case 'applepay':
        return (
          <div className="mt-6 text-center">
            <button
              onClick={handlePayment}
              className={`w-full py-3 rounded font-semibold text-white ${
                selectedMethod === 'googlepay' ? 'bg-gray-800' : 'bg-black'
              }`}
            >
              Pay with {selectedMethod === 'googlepay' ? 'Google Pay' : 'Apple Pay'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg text-center max-w-sm w-full mx-4">
          <svg className="animate-spin text-4xl text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold mb-2">{processingStep}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
          </div>
          <p className="text-sm text-gray-500">Please do not close this window</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg text-center max-w-sm w-full mx-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
          <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

        {/* Booking Summary */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Movie</span>
              <span className="font-medium">{booking.movie.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium">
                {new Date(booking.date).toLocaleDateString()} - {booking.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seats</span>
              <span className="font-medium">{booking.seats.join(', ')}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total Amount</span>
              <span>${booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-full ${method.color} text-white flex items-center justify-center mx-auto mb-2`}>
                  {method.icon}
                </div>
                <p className="font-semibold">{method.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        {selectedMethod && renderPaymentForm()}

        {/* Pay Button (only for card payments) */}
        {selectedMethod === 'card' && (
          <button
            onClick={handlePayment}
            disabled={!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv}
            className={`w-full py-3 rounded-lg text-white font-semibold mt-6 ${
              !paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Pay ${booking.totalAmount.toFixed(2)}
          </button>
        )}
      </div>
    </div>
  );
};

export default Payment; 