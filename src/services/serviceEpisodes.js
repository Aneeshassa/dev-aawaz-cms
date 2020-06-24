import http from '../http-common';
import auth from './authentication';
const baseURL = "https://api.samortech.com/api";

const removeEpisode = (id) => {
    return http.delete(`${baseURL}/episodes/${id}/`, {auth: auth});
};

export {
    removeEpisode
}