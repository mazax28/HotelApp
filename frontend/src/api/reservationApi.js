import axios from 'axios'; // o fetch, como prefieras
axios.defaults.withCredentials = true; // Para enviar cookies con las peticiones

const API_URL = 'http://localhost:3000/api/reservations';

const createReservation = async reservationData => {
  try {
    const response = await axios.post(API_URL, {
      hotelId: reservationData.hotelId,
      roomId: reservationData.roomId,
      clientId: reservationData.clientId,
      checkInDate: reservationData.checkInDate,
      checkOutDate: reservationData.checkOutDate,
      guestCount: reservationData.numberOfPeople,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

const getAllReservations = async filters => {
  try {
    // hotelId and checkInDate are required according to the backend
    if (!filters.hotelId || !filters.checkInDate) {
      throw new Error('Hotel ID and check-in date are required filters');
    }

    // Si tenemos documento de cliente, lo enviamos con el nombre de parámetro correcto
    const params = { ...filters };
    // Verificamos si existe clientDocument
    if (params.clientDocument) {
      // El backend ya está configurado para manejar el parámetro clientDocument
      // Eliminamos el clientId si existe para evitar confusiones
      if (params.clientId) {
        delete params.clientId;
      }
    }

    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

const getRoomMapByFloor = async (hotelId, date = null) => {
  try {
    if (!hotelId) {
      throw new Error('El ID del hotel es obligatorio');
    }

    const params = { hotelId };
    if (date) {
      params.date = date;
    }

    const response = await axios.get(`${API_URL}/room-map`, { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el mapa de habitaciones:', error);
    throw error;
  }
};

export { createReservation, getAllReservations, getRoomMapByFloor };
