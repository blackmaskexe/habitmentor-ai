import axios from "axios";

const apiUrl = "http://10.0.0.194:3001/habit-mentor";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
