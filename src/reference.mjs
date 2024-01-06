const { VITE_API_ENDPOINT } = import.meta.env;

export const API_URL = `${VITE_API_ENDPOINT}/api`;

// Auth
const AUTH_URL = `/auth`;
export const AUTH_LOGIN_URL = `${AUTH_URL}/login`;
export const AUTH_REGISTER_URL = `${AUTH_URL}/register`;
export const AUTH_VALIDATE_URL = `${AUTH_URL}/validate`;

export const MANAGE_URL = `/manage`;

export const MANAGE_USER_URL = `${MANAGE_URL}/user`;
export const MANAGE_USER_LIST_URL = `${MANAGE_USER_URL}/list`;
