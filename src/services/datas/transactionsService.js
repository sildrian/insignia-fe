import {apiClient} from '../client';

export const OnTopTrxByUserPagination = async (payload) => {
  let config = {
    method: 'get',
    url: "top_transaction_per_user_pagination?"+payload.queryParams,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + payload.token,
    }
  };

  return apiClient(config)
  .then(response => response)
  .catch(error => error);;
};

export const OnTopTrxByUser = async (payload) => {
  let config = {
    method: 'get',
    url: "top_transaction_per_user",
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + payload.token,
    }
  };

  return apiClient(config)
  .then(response => response)
  .catch(error => error);;
};

export const OnTopTotalTrxByUser = async (payload) => {
  let config = {
    method: 'get',
    url: "top_users",
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + payload.token,
    }
  };

  return apiClient(config)
  .then(response => response)
  .catch(error => error);;
};

export const OnGetUser = async (payload) => {
  let config = {
    method: 'get',
    url: "user",
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + payload.token,
    }
  };

  return apiClient(config)
  .then(response => response)
  .catch(error => error);;
};