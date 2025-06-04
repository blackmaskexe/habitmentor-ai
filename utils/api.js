import axios from "axios";

const apiUrl =
  "https://621f-2601-447-c801-dd00-748f-5e6-7eef-20df.ngrok-free.app/habit-mentor";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000, // timeout request after 10 seconds
});

export default api;
