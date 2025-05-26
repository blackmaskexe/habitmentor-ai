import axios from "axios";

const apiUrl = "http://localhost:3001/habit-mentor";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
