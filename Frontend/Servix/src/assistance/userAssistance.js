import { axiosInstance } from "../axios/axiosinstance";

export const listServices = async () => {
  try {
    console.log('Fetching services from:', axiosInstance.defaults.baseURL + 'listservices');
    const response = await axiosInstance.get("/listservices");
    console.log('Services response:', response);
    return response;
  } catch (error) {
    console.error('Error in listServices:', error);
    console.error('Error details:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data
    });
    throw error;
  }
};

// List services by category (e.g. plumbing, cleaning, electrical, carpenter, appliance, saloon, others)
export const listServicesByCategory = async (category) => {
  try {
    console.log('Fetching services by category from:', axiosInstance.defaults.baseURL + `/listservices?category=${encodeURIComponent(category)}`);
    const response = await axiosInstance.get(`/listservices?category=${encodeURIComponent(category)}`);
    console.log('Services by category response:', response);
    return response;
  } catch (error) {
    console.error('Error in listServicesByCategory:', error);
    console.error('Error details:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data
    });
    throw error;
  }
};

export const getServiceDetails = (serviceId) => {
  return axiosInstance.get(`/serviceDetails/${serviceId}`);
};

export const userSignUp = (data) => {
  return axiosInstance.post("/user/register", data);
};

export const userLogin = (data) => {
  return axiosInstance.post("/user/login", data);
};

export const userLogout = () => {
  return axiosInstance.post("/user/logout");
};

export const addToCart = (serviceId) => {
  return axiosInstance.post(`/cart/addtocart/${serviceId}`);
};

export const getCartItems = () => {
  return axiosInstance.get("/cart/mycart");
};

export const removeFromCart = (serviceId) => {
  return axiosInstance.delete(`/cart/remove/${serviceId}`);
};

export const updateCartItemQuantity = (serviceId, quantity) => {
  return axiosInstance.put(`/cart/update-quantity/${serviceId}`, { quantity });
};

export const clearCart = () => {
  return axiosInstance.delete('/cart/clear');
};

// Create Stripe Checkout Session
export const createCheckoutSession = (payload = {}) => {
  return axiosInstance.post("/payment/create-checkout-session", payload);
};

// Verify Payment
export const verifyPayment = (sessionId) => {
  return axiosInstance.get(`/payment/verify-payment/${sessionId}`);
};

// Get User Bookings
export const getUserBookings = () => {
  return axiosInstance.get("/bookings/my-bookings");
};

// Cancel Booking
export const cancelBooking = (bookingId) => {
  return axiosInstance.put(`/bookings/cancel/${bookingId}`);
};

// Confirm legacy booking completion
export const completeLegacyBooking = (bookingId) => {
  return axiosInstance.put(`/bookings/complete/${bookingId}`);
};

// Service Request (client) APIs
export const getClientRequests = () => {
  return axiosInstance.get(`/service-request/my-requests`);
};

export const confirmServiceCompletion = (requestId) => {
  return axiosInstance.put(`/service-request/${requestId}/confirm`);
};

export const cancelServiceRequest = (requestId) => {
  return axiosInstance.put(`/service-request/${requestId}/cancel`);
};