import axios from 'axios'; // o fetch, como prefieras
axios.defaults.withCredentials = true; // Para enviar cookies con las peticiones

const API_URL = 'http://localhost:8000/api/reservations';


const createReservation = async (reservationData) => {
  try {
    
    const response = await axios.post(API_URL,{
        hotelId: reservationData.hotelId,
        roomId: reservationData.roomId,
        clientId: reservationData.clientId,
        checkInDate: reservationData.checkInDate,
        checkOutDate: reservationData.checkOutDate,
        guestCount: reservationData.numberOfPeople
    });
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};


const getAllReservations = async (filters) => {
  try {
    // hotelId and checkInDate are required according to the backend
    if (!filters.hotelId || !filters.checkInDate) {
      throw new Error('Hotel ID and check-in date are required filters');
    }
    
    const response = await axios.get(API_URL, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

export {
  createReservation,
  getAllReservations
};