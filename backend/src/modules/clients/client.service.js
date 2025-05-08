const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => {
  const { document, name, surname } = data;
  
  return await prisma.client.create({
    data: {
      document,
      firstName: name,      // Map name to firstName in schema
      lastName: surname     // Map surname to lastName in schema
    }
  });
};


const getByDocument = async (document) => {
  return await prisma.client.findUnique({
    where: { document },
    include: {
      reservations: {
        include: {
          hotel: true,
          room: true
        }
      }
    }
  });
};

// Para el filtrado de reservas por cliente
const getAll = async () => {
  return await prisma.client.findMany();
};



const clientService = {
  create,
  getByDocument,
  getAll,
};

export { clientService };