import axios from 'axios';
import Realm from 'realm';
import TokenSchema from '../realmModel/TokenSchema';

const realm = new Realm({ schema: [TokenSchema] });

const api = axios.create({
  //   baseURL: process.env.API_URL,
  baseURL: 'https://cbe3-116-108-13-19.ngrok-free.app/api',

  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  function (config) {
    //get token from realm
    const token = realm.objects<TokenSchema>('Token') as any;
    const accessToken = token[0]?.accessToken;
    // console.log('accessToken:', accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default api;
