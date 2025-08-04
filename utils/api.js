import axios from "axios";

const apiUrl = "https://api-tp7jjwrliq-uc.a.run.app/";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000, // timeout request after 10 seconds
});

export default api;
