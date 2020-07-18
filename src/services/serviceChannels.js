import http from '../http-common';
import auth from './authentication';

const baseURL = "https://prod.aawaz.com/api";


const getAllChannel = () => {
    return http.get(`${baseURL}/channels/?all=True`, {auth: auth});
}

const getAllChannelPagination = (page=1) => {
    return http.get(`${baseURL}/channels/?page=${page}`, {auth: auth});
}

const getChannelDropdown = () => {
    return http.get(`${baseURL}/channels/?all=True&only_select=True`, {auth: auth});
}

const get = id => {
    return http.get(`${baseURL}/channels/${id}/`, {auth: auth});
}

const create = data => {
    return http.post(`${baseURL}/channels/`, {auth: auth, data: data});
}

const updateChannel = (id, data) => {
    return http.patch(`${baseURL}/channels/${id}/`, data, {auth:auth});
}

const removeChannel = id => {
    return http.delete(`${baseURL}/channels/${id}/`, {auth: auth});
}

const removeAll = () => {
    return http.delete(`${baseURL}/channels`, {auth: auth});
}

const findByTitle = title => {
    return http.get(`${baseURL}/channels?title=${title}/`, {auth: auth});
}

export  {
    getAllChannel,
    getChannelDropdown,
    getAllChannelPagination,
    get,
    create,
    updateChannel,
    removeChannel,
    removeAll,
    findByTitle,
    baseURL
};
