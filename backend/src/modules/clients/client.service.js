import {prismaClient as prisma} from '../../utils/prisma.js'

const create = async (data) => {
  console.log(data);
  const { document, firstName, lastName } = data;
  
  return await prisma.client.create({
    data: {
      document,
      firstName,
      lastName   
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