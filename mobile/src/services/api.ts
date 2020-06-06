import axios from 'axios';

const api_url = 'http://192.168.0.13';
const api_port = '3333';

const api = axios.create({
    baseURL: `${api_url}:${api_port}`
});

export default api;