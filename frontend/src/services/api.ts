import axios from 'axios';

import settings from '../settings';

const api = axios.create({
    baseURL: `http://${settings.server_address}:${settings.server_port}`
});

export default api;