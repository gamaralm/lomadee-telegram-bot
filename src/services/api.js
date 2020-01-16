import 'dotenv/config';
import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'development'
    ? process.env.LOMADEE_URL_DEV
    : process.env.LOMADEE_URL_PROD;

const api = axios.create({
  baseURL: baseURL + process.env.LOMADEE_TOKEN,
});

api.interceptors.request.use(config => {
  config.params = config.params || {};
  config.params.sourceId = process.env.LOMADEE_SOURCEID;

  return config;
});

export default api;
