import axios from "axios";
import { API_URL } from "../reference.mjs";
import { showAlert } from "../store/alert.mjs";
import { loadingState } from "../store/index.mjs";

const APIHelper = axios.create({
  baseURL: API_URL,
  timeout: 3000,
});

let requestCount = 0;

const responseHandler = (response) => {
  response.data?.message && showAlert("success", response.data.message);
  console.log("handle response", response);
  requestCount--;
  if (requestCount === 0) loadingState.value = false;
  return response.data;
};

const errorHandler = (error) => {
  error?.response?.data?.message &&
    showAlert("error", error.response.data.message);
  console.log("handle error", error);
  requestCount--;
  if (requestCount === 0) loadingState.value = false;
  return Promise.reject(error.message);
};

APIHelper.interceptors.response.use(responseHandler, errorHandler);
APIHelper.interceptors.request.use(
  (request) => {
    if (requestCount === 0) loadingState.value = true;
    requestCount++;
    return request;
  },
  (error) => error
);

APIHelper.interceptors.re;

export const setAuthorization = (authorization) => {
  APIHelper.interceptors.request.clear();
  APIHelper.interceptors.request.use(
    (request) => {
      if (requestCount === 0) loadingState.value = true;
      requestCount++;
      request.headers["Authorization"] = authorization;
      return request;
    },
    (error) => error
  );
};
export default APIHelper;
