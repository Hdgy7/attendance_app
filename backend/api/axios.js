import axios from 'axios';
const instance = axios.create({ baseURL: 'https://attendance-app-xtnq.onrender.com/api/' });
export default instance;
