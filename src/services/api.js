import 'dotenv/config';
import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'development'
    ? process.env.LOMADEE_URL_DEV
    : process.env.LOMADEE_URL_PROD;

const api = axios.create({
  baseURL: baseURL + process.env.LOMADEE_TOKEN,
});

export default api;
