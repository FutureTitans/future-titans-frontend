import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'future_titans_token';
const REFRESH_TOKEN_KEY = 'future_titans_refresh_token';
const USER_KEY = 'future_titans_user';

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return Cookies.get(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token) => {
  Cookies.set(AUTH_TOKEN_KEY, token, { expires: 0.625 }); // 15 minutes
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return Cookies.get(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token) => {
  Cookies.set(REFRESH_TOKEN_KEY, token, { expires: 7 });
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

export const isStudent = () => {
  const user = getUser();
  return user?.role === 'student';
};

