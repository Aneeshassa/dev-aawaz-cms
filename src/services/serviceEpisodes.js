import http from '../http-common';
import auth from './authentication';
const baseURL = "https://prod.aawaz.com/api";

const removeEpisode = (id) => {
    return http.delete(`${baseURL}/episodes/${id}/`, {auth: auth});
};

export {
    removeEpisode
}