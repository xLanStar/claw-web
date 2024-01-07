const { VITE_API_ENDPOINT } = import.meta.env;

export const API_URL = `${VITE_API_ENDPOINT}/api`;

// Auth
const AUTH_URL = `/auth`;
export const AUTH_LOGIN_URL = `${AUTH_URL}/login`;
export const AUTH_REGISTER_URL = `${AUTH_URL}/register`;
export const AUTH_VALIDATE_URL = `${AUTH_URL}/validate`;

// Manage
export const MANAGE_URL = `/manage`;

// Manage-User
export const MANAGE_USER_URL = `${MANAGE_URL}/user`;
export const MANAGE_USER_LIST_URL = `${MANAGE_USER_URL}/list`;
export const MANAGE_USER_LOGIN_LOG_URL = `${MANAGE_USER_URL}/loginlog`;

// Manage-Site
export const MANAGE_SITE_URL = `${MANAGE_URL}/site`;
export const MANAGE_SITE_LIST_URL = `${MANAGE_SITE_URL}/list`;

// User
export const USER_URL = `/user`;
export const USER_INFO_URL = `${USER_URL}/info`;
export const USER_LOGIN_LOG_URL = `${USER_URL}/loginlog`;
