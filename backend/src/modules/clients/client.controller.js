const { clientService } = require('./client.service');

// Crear un nuevo cliente
const createClient = async (req, res) => {
  try {
    const data = req.body;
    const newClient = await clientService.create(data);
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: 'Error creating client', error });
  }
};

const  getAll = async (req, res) => {
  try {
    const clients = await clientService.getAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving clients', error });
  }
};
// Obtener cliente por documento
const getClientByDocument = async (req, res) => {
  try {
    const { document } = req.params;
    const client = await clientService.getByDocument(document);
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving client', error });
  }
};

export  { createClient, getClientByDocument,getAll};
