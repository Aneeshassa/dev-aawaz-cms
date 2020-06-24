import axios from 'axios';

export default axios.create({
    baseURL: "https://api.samortech.com/api",
    headers: {
        "Content-type": "application/json"
    }
});