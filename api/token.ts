import axios from 'axios';

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

api.interceptors.request.use(
    function (config) {
        console.log(api.defaults.baseURL)

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    function (response) {
        console.log(response);

        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default api;