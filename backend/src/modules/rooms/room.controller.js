import { roomService } from "./room.service.js";

// Crear una nueva habitación
const createRoom = async (req, res) => {
  try {
    const data = req.body;
    const newRoom = await roomService.create(data);
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error });
  }
};

// Obtener todas las habitaciones
const getAllRooms = async (req, res) => {
  try {
    const filters = req.query;
    const rooms = await roomService.getAll(filters);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving rooms', error });
  }
};



// Actualizar habitación por ID
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedRoom = await roomService.update(Number(id), data);
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


export { createRoom, getAllRooms, updateRoom, deleteRoom };
