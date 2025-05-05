import axios from "axios";

const apiUrl = "http://10.0.0.162:3000";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
