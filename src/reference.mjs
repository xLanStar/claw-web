const { VITE_API_ENDPOINT } = import.meta.env;

export const API_URL = `${VITE_API_ENDPOINT}/api`;

// Resource
export const RESOURCE_URL = `${VITE_API_ENDPOINT}/resource`;

// Resource-Image
export const RESOURCE_IMAGE_URL = `${RESOURCE_URL}/image`;

// Resource-Image-DrawPrize
export const RESOURCE_IMAGE_DRAWPRIZE_URL = `${RESOURCE_IMAGE_URL}/drawprize`;

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

// Manage-Machine
export const MANAGE_MACHINE_URL = `${MANAGE_URL}/machine`;
export const MANAGE_MACHINE_LIST_URL = `${MANAGE_MACHINE_URL}/list`;
export const MANAGE_MACHINE_ALL_QRCODE_URL = `${MANAGE_MACHINE_URL}/all-qrcode`;

// Manage-QRCode
export const MANAGE_QRCODE_URL = `${MANAGE_URL}/qrcode`;
export const MANAGE_QRCODE_LIST_URL = `${MANAGE_QRCODE_URL}/list`;

// Manage-QRCodeContent
export const MANAGE_QRCODECONTENT_URL = `${MANAGE_URL}/qrcodecontent`;
export const MANAGE_QRCODECONTENT_LIST_URL = `${MANAGE_QRCODECONTENT_URL}/list`;

// Manage-QRCodeContent
export const MANAGE_QRCODEITEM_URL = `${MANAGE_URL}/qrcodeitem`;
export const MANAGE_QRCODEITEM_LIST_URL = `${MANAGE_QRCODEITEM_URL}/list`;

// Manage-Draw
export const MANAGE_DRAW_URL = `${MANAGE_URL}/draw`;
export const MANAGE_DRAW_LIST_URL = `${MANAGE_DRAW_URL}/list`;

// Manage-DrawPrize
export const MANAGE_DRAWPRIZE_URL = `${MANAGE_URL}/drawprize`;
export const MANAGE_DRAWPRIZE_IMAGE_URL = `${MANAGE_DRAWPRIZE_URL}/image`;
// export const MANAGE_DRAWPRIZE_LIST_URL = `${MANAGE_DRAWPRIZE_URL}/list`;

// Manage-DrawEvent
export const MANAGE_DRAWEVENT_URL = `${MANAGE_URL}/drawevent`;
// export const MANAGE_DRAWEVENT_LIST_URL = `${MANAGE_DRAWEVENT_URL}/list`;

// Manage-Claw
export const MANAGE_CLAW_URL = `${MANAGE_URL}/claw`;
export const MANAGE_CLAW_LIST_URL = `${MANAGE_CLAW_URL}/list`;

// User
export const USER_URL = `/user`;
export const USER_INFO_URL = `${USER_URL}/info`;
export const USER_LOGIN_LOG_URL = `${USER_URL}/loginlog`;

// QRCode
export const QRCODE_URL = `/qrcode`;
export const QRCODE_CLAIM_URL = `${QRCODE_URL}/claim`;

// Draw
export const DRAW_URL = `/draw`;
export const DRAW_LIST_URL = `${DRAW_URL}/list`;
