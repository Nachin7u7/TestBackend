import axios from 'axios';
import { config } from '../config';

// Si config está correctamente tipado, TypeScript debería poder inferir los tipos aquí.
// De lo contrario, podrías necesitar definir una interfaz para jdoodle.
const { jdoodle } = config;

const jdoodleAxios = axios.create({
  baseURL: jdoodle.url, // Asume que jdoodle.url es un string.
  headers: {
    'Content-Type': 'application/json',
  },
});

export default jdoodleAxios;
