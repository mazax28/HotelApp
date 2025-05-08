const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// creacion del hotel en el frontend
const create = async (data) => {
  const { name, address } = data;
  
  return await prisma.hotel.create({
    data: {
      name,
      address
    }
  });
};

// Para el selector en el filtro de reservas
const getAll = async () => {
  return await prisma.hotel.findMany();
};

// para la edicion de los hoteles
const update = async (id, data) => {
  try {
    return await prisma.hotel.update({
      where: { id },
      data
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
};

// para eliminar el hotel
const deleteHotel = async (id) => {
  try {
    return await prisma.hotel.delete({
      where: { id }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
};

const hotelService = {
  create,
  getAll,
  update,
  delete: deleteHotel
};

export { hotelService };