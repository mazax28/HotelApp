const { hotelService } = require('./hotel.service');

// Crear un nuevo hotel
const createHotel = async (req, res) => {
  try {
    const data = req.body;
    const newHotel = await hotelService.create(data);
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


// Actualizar un hotel
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedHotel = await hotelService.update(Number(id), data);
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

export { createHotel, getAllHotels, updateHotel, deleteHotel };
