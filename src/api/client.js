import axios from "axios";
import { API_BASE } from "../config";
import { currentSession } from "../auth/cognito";

const client = axios.create({ baseURL: API_BASE, timeout: 30000 });

client.interceptors.request.use(async config => {
  try {
    const token = await currentSession();
    config.headers.Authorization = token;
  } catch {
    const token = localStorage.getItem("suivia_token");
    if (token) config.headers.Authorization = token;
  }
  return config;
});

client.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("suivia_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default client;
