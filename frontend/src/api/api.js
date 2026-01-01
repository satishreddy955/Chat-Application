import axios from "axios";

const API = axios.create({
  baseURL: "https://chat-application-yy3j.onrender.com/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
