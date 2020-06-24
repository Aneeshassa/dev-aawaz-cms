import http from '../http-common';
import auth from './authentication';

const baseURL = "https://staging.samortech.com/api";

const getAllArtist = () => {
    return http.get(`${baseURL}/artists/?limit=200`, {auth: auth});
};

const getArtist = id => {
    return http.get(`${baseURL}/artists/${id}/`, {auth: auth});
}

const createArtist = data => {
    return http.post(`${baseURL}/artists/`, {auth: auth, data: data});
}

const updateArtist = (id, data) => {
    return http.patch(`${baseURL}/artists/${id}/`, {auth: auth, data: data});
}

const removeArtist = id => {
    return http.delete(`${baseURL}/artists/${id}`, {auth: auth});
}


export {
    getAllArtist, getArtist, createArtist, updateArtist, removeArtist, baseURL
}