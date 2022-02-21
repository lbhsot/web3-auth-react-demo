import axios from 'axios';

export const commonApi = axios.create({
  baseURL: '/api',
  timeout: 60000,
});

commonApi.interceptors.request.use((config) => {
  const message = localStorage.getItem('cobo-siwe-message');
  if (message && config.headers) {
    config.headers['cobo-siwe-message'] = JSON.stringify(message);
  }
  const signature = localStorage.getItem('cobo-siwe-signature');
  if (signature && config.headers) {
    config.headers['cobo-siwe-signature'] = signature;
  }
  return config;
}, (error) => Promise.reject(error));

commonApi.interceptors.response.use((response) => response.data, (error) => {
  if (error.response.data.statusCode === 401) {
    localStorage.removeItem('cobo-siwe-message');
    localStorage.removeItem('cobo-siwe-signature');
  }
  return Promise.reject(error);
});
