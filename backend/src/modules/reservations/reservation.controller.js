const { reservationService } = require('./reservation.service');

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
    res.status(500).json({ message: 'Error retrieving reservations', error });
  }
};



export { createReservation, getAllReservations};
