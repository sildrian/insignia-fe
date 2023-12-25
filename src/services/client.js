import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    responseType: 'json',
    transformRequest: [
      function (data, _headers) {
        return data;
      },
    ],
});

export {
    apiClient,
};