import http from '../http-common';
import auth from './authentication';

const baseURL = "https://api.samortech.com/api";
const getAllBadge = () => {
    return http.get(`${baseURL}/badges/?limit=100`, {auth: auth});
};

const getBadge = id => {
    return http.get(`${baseURL}/badges/${id}`, {auth: auth});
}

const createBadge = data => {
    return http.post(`${baseURL}/badges/`, {auth: auth, data: data});
}

const updateBadge = (id, data) => {
    return http.patch(`${baseURL}/badges/${id}/`, data, {auth: auth});
}

const removeBadge = id => {
    return http.delete(`${baseURL}/badges/${id}/ `, {auth: auth});
}


export  {
    getAllBadge,
    getBadge,
    createBadge,
    updateBadge,
    removeBadge,
    baseURL
};
