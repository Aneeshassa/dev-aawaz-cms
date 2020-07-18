import http from '../http-common';
import auth from './authentication';

const baseURL = "https://prod.aawaz.com/api";

const getAllArtist = () => {
    return http.get(`${baseURL}/artists/?limit=200`, {auth: auth});
};

const getArtistDropDown = () => {
    return http.get(`${baseURL}/artists/?all=True&only_select=True`, {auth: auth});
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
    getAllArtist,getArtistDropDown, getArtist, createArtist, updateArtist, removeArtist, baseURL
}