import axios from 'axios'; // o fetch, como prefieras
axios.defaults.withCredentials = true; // Para enviar cookies con las peticiones

const API_URL = 'http://localhost:3000/api/hotels';

const createHotel = async hotelData => {
  try {
    const response = await axios.post(API_URL, {
      name: hotelData.name,
      address: hotelData.address,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating hotel:', error);
    throw error;
  }
};

const getAllHotels = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
};

const updateHotel = async (id, hotelData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      name: hotelData.name,
      address: hotelData.address,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating hotel:', error);
    throw error;
  }
};

const deleteHotel = async id => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting hotel:', error);
    throw error;
  }
};

export { createHotel, getAllHotels, updateHotel, deleteHotel };
