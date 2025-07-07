import axios from "axios";

const axiosRasa = axios.create({
    baseURL: process.env.REACT_APP_RASA_URL,
    withCredentials: false,
});

export default axiosRasa;