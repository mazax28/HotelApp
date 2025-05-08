const { hotelService } = require('./hotel.service');

// Crear un nuevo hotel
const createHotel = async (req, res) => {
  try {
    const { name, address } = req.body;
    const newHotel = await hotelService.create({ name, address });
    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ message: 'Error creating hotel', error });
  }
};

// Obtener todos los hoteles
const getAllHotels = async (req, res) => {
  try {
    const hotels = await hotelService.getAll();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving hotels', error });
  }
};

// Obtener un hotel específico
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await hotelService.getById(Number(id));
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving hotel', error });
  }
};

// Actualizar un hotel
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;
    const updatedHotel = await hotelService.update(Number(id), { name, address });
    if (updatedHotel) {
      res.json(updatedHotel);
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating hotel', error });
  }
};

// Eliminar un hotel
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHotel = await hotelService.delete(Number(id));
    if (deletedHotel) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting hotel', error });
  }
};

export { createHotel, getAllHotels, getHotelById, updateHotel, deleteHotel };
