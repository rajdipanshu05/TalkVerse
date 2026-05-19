import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
    baseURL: import.meta.env.MODE === "https://talkverse-c8lp.onrender.com/api"
    withCredentials: true
})