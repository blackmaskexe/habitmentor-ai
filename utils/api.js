import axios from "axios";

const apiUrl = "https://www.habitmentorapi.prathamsnehi.com/habit-mentor";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000, // timeout request after 10 seconds
});

export default api;
