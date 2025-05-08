const { roomService } = require('./room.service');

// Crear una nueva habitación
const createRoom = async (req, res) => {
  try {
    const { hotelId, roomNumber, floor, capacity, features } = req.body;
    const newRoom = await roomService.create({ hotelId, roomNumber, floor, capacity, features });
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error });
  }
};

// Obtener todas las habitaciones
const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAll();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving rooms', error });
  }
};

// Obtener habitación por ID
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await roomService.getById(Number(id));
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving room', error });
  }
};

// Actualizar habitación por ID
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomNumber, floor, capacity, features } = req.body;
    const updatedRoom = await roomService.update(Number(id), { roomNumber, floor, capacity, features });
    if (updatedRoom) {
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating room', error });
  }
};

// Eliminar habitación por ID
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoom = await roomService.delete(Number(id));
    if (deletedRoom) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error });
  }
};

// Filtrar habitaciones por hotel
const getRoomByHotel = async (req, res) => {
  try {
    const { hotelId } = req.query;
    const rooms = await roomService.getByHotel(Number(hotelId));
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving rooms by hotel', error });
  }
};

export { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom, getRoomByHotel };
