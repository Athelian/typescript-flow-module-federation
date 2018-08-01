// @flow
import Cookies from 'js-cookie';

export const getAuthToken = () => Cookies.get('token') || '';

export const setAuthToken = (token: string) => {
  const EXPIRE_TIME = 7; // 7 days
  Cookies.set('token', token, { expires: EXPIRE_TIME });
};

export const removeAuthToken = () => Cookies.remove('token');

export const isAuthenticated = () => !!getAuthToken();

export const reloadPageOnExpireToken = () => {
  removeAuthToken();
  window.location.reload();
};
