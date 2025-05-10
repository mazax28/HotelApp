import axios from 'axios'; // o fetch, como prefieras
axios.defaults.withCredentials = true; // Para enviar cookies con las peticiones

const API_URL = 'http://localhost:3000/api/rooms';

const createRoom = async roomData => {
  try {
    const response = await axios.post(API_URL, {
      hotelId: roomData.hotelId,
      number: roomData.roomNumber, // string
      floor: roomData.floor, // string
      capacity: roomData.capacity,
      description: roomData.description,
      positionX: roomData.positionX || 0,
      positionY: roomData.positionY || 0,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

const getAllRooms = async filters => {
  try {
    const { checkInDate, checkOutDate } = filters;
    if (!checkInDate || !checkOutDate) {
      throw new Error('Las fechas de entrada y salida son requeridas');
    }
    const response = await axios.get(API_URL, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

const updateRoom = async (id, roomData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      number: roomData.roomNumber,
      floor: roomData.floor, // string
      capacity: roomData.capacity,
      description: roomData.description,
      positionX: roomData.positionX || 0,
      positionY: roomData.positionY || 0,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

const deleteRoom = async id => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

export { createRoom, getAllRooms, updateRoom, deleteRoom };
