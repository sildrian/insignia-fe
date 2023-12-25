import {apiClient} from '../client';

export const OnLogin = async (payload) => {
  let data = JSON.stringify(payload);
  let config = {
    method: 'post',
    url: "login",
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  return apiClient(config)
  .then(response => response)
  .catch(error => error);;
};