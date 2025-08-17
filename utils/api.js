import axios from "axios";

const apiUrl = "https://api-tp7jjwrliq-uc.a.run.app/";
// const apiUrl = "http://127.0.0.1:5001/habitmentor-ai/us-central1/api/";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000, // timeout request after 10 seconds
});

export default api;
