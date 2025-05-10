import axios from 'axios'; // o fetch, como prefieras
axios.defaults.withCredentials = true; // Para enviar cookies con las peticiones

const API_URL = 'http://localhost:3000/api/clients';

const createClient = async clientData => {
  try {
    // Ensure data is structured as expected by the backend
    const payload = {
      document: clientData.document,
      firstName: clientData.firstName,
      lastName: clientData.lastName,
    };

    const response = await axios.post(API_URL, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

const getAllClients = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

const getClientByDocument = async document => {
  try {
    const response = await axios.get(`${API_URL}/${document}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
};

export { createClient, getAllClients, getClientByDocument };
