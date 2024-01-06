import ApiHelper, { setAuthorization } from "../helper/APIHelpr.mjs";
import {
  AUTH_LOGIN_URL,
  AUTH_REGISTER_URL,
  AUTH_VALIDATE_URL,
} from "../reference.mjs";
import { userState } from "../store/auth.mjs";

export const validate = async () => {
  const token = localStorage.getItem("token");
  console.log("[驗證] 本機Token:", token);
  if (!token) return;

  await ApiHelper.post(AUTH_VALIDATE_URL, null, {
    headers: { Authorization: token },
  })
    .then(({ user }) => {
      userState.value = user;
      setAuthorization(token);
      console.log("[驗證] 驗證成功，使用者名稱:", user.name);
    })
    .catch((err) => {
      localStorage.removeItem("token");
      console.log("[驗證] 驗證失敗，錯誤:", err);
    });
};

export const login = (uEmail, uPassword) =>
  ApiHelper.post(AUTH_LOGIN_URL, {
    uEmail,
    uPassword,
  })
    .then(({ token, user }) => {
      userState.value = user;
      setAuthorization(token);
      localStorage.setItem("token", token);
      console.log("[驗證] 登入成功，使用者名稱:", user);
    })
    .catch((err) => console.log("[驗證] 登入失敗，錯誤:", err));

export const logout = () => {
  if (!userState.value) {
    console.log("[驗證] 並未登入");
    return;
  }
  console.log("[驗證] 登出");
  userState.value = null;
  localStorage.removeItem("token");
  setAuthorization(null);
};

export const register = async (
  uEmail,
  uPassword,
  uName,
  uPhoneNumber,
  uAdress
) =>
  ApiHelper.post(AUTH_REGISTER_URL, {
    uEmail,
    uPassword,
    uName,
    uPhoneNumber,
    uAdress,
  })
    .then(({ token, user }) => {
      userState.value = user;
      setAuthorization(token);
      localStorage.setItem("token", token);
      console.log("[驗證] 登入成功，使用者名稱:", user);
    })
    .catch((err) => console.log("[驗證] 註冊失敗，錯誤:", err.name));
