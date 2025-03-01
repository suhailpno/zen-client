import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const createPaymentIntent = async (bookingData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payments/create-payment-intent`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const processPaypalPayment = async (bookingData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payments/paypal`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}; 