import axios from "axios";

const apiUrl =
  "https://b683-2601-447-c801-dd00-d101-11b2-139f-ca11.ngrok-free.app/habit-mentor";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000, // timeout request after 10 seconds
});

export default api;
