const { clientService } = require('./client.service');

// Crear un nuevo cliente
const createClient = async (req, res) => {
  try {
    const { document, name, surname } = req.body;
    const newClient = await clientService.create({ document, name, surname });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: 'Error creating client', error });
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

export  { createClient, getClientByDocument };
