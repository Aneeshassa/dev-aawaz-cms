import http from '../http-common';
import auth from './authentication';
const baseURL = "https://staging.samortech.com/api";

const removeEpisode = (id) => {
    return http.delete(`${baseURL}/episodes/${id}/`, {auth: auth});
};

export {
    removeEpisode
}