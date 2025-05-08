const { reservationService } = require('./reservation.service');

// Crear una nueva reserva
const createReservation = async (req, res) => {
  try {
    const { hotelId, roomId, clientId, checkInDate, checkOutDate, numberOfPeople } = req.body;
    const newReservation = await reservationService.create({ hotelId, roomId, clientId, checkInDate, checkOutDate, numberOfPeople });
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation', error });
  }
};

// Obtener todas las reservas
const getAllReservations = async (req, res) => {
  try {
    const { hotelId, checkInDate, checkOutDate, clientId } = req.query;
    const reservations = await reservationService.getAll({ hotelId, checkInDate, checkOutDate, clientId });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reservations', error });
  }
};

// Obtener una reserva por ID
const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await reservationService.getById(Number(id));
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reservation', error });
  }
};

// Actualizar una reserva
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkInDate, checkOutDate, numberOfPeople } = req.body;
    const updatedReservation = await reservationService.update(Number(id), { checkInDate, checkOutDate, numberOfPeople });
    if (updatedReservation) {
      res.json(updatedReservation);
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation', error });
  }
};

// Eliminar una reserva
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReservation = await reservationService.delete(Number(id));
    if (deletedReservation) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reservation', error });
  }
};

export { createReservation, getAllReservations, getReservationById, updateReservation, deleteReservation };
