import axios from "axios";

const api = axios.create({
    baseURL: 'https://server-rock-paper-scissor-f0v9.onrender.com',
    withCredentials: true
});

export default api;