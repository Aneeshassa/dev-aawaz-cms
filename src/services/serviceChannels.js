import http from '../http-common';
import auth from './authentication';

const baseURL = "https://api.samortech.com/api";


const getAllChannel = () => {
    return http.get(`${baseURL}/channels/?limit=100`, {auth: auth});
}

const get = id => {
    return http.get(`${baseURL}/channels/${id}`, {auth: auth});
}

const create = data => {
    return http.post(`${baseURL}/channels`, {auth: auth, data: data});
}

const updateChannel = (id, data) => {
    return http.patch(`${baseURL}/channels/${id}`, {auth: auth, data: data});
}

const removeChannel = id => {
    return http.delete(`${baseURL}/channels/${id}`, {auth: auth});
}

const removeAll = () => {
    return http.delete(`${baseURL}/channels`, {auth: auth});
}

const findByTitle = title => {
    return http.get(`${baseURL}/channels?title=${title}`, {auth: auth});
}

export  {
    getAllChannel,
    get,
    create,
    updateChannel,
    removeChannel,
    removeAll,
    findByTitle,
    baseURL
};
