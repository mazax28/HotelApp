import { reservationService } from './reservation.service.js';
// Crear una nueva reserva
const createReservation = async (req, res) => {
  try {
    const data = req.body;
    const newReservation = await reservationService.create(data);
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation', error });
  }
};

// Obtener todas las reservas
const getAllReservations = async (req, res) => {
  try {
    const filters = req.query;
    const reservations = await reservationService.getAll(filters);
    res.json(reservations);
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error retrieving reservations',
        error: error.message || 'Ocurrio un error inesperado',
      });
  }
};

// Obtener el mapa de habitaciones por pisos
const getRoomMapByFloor = async (req, res) => {
  try {
    const { hotelId, date } = req.query;

    if (!hotelId) {
      return res
        .status(400)
        .json({ message: 'El ID del hotel es obligatorio' });
    }

    const roomMap = await reservationService.getRoomMapByFloor(hotelId, date);
    res.json(roomMap);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el mapa de habitaciones',
      error: error.message || 'Ocurrió un error inesperado',
    });
  }
};

export { createReservation, getAllReservations, getRoomMapByFloor };
