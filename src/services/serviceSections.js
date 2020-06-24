import http from '../http-common';
import auth from './authentication'

const baseURL = "https://staging.samortech.com/api";

const getAll = () => {
    return http.get(`${baseURL}/section/`, {auth: auth});
};

const getAllSectionsPagination = (page=0) => {
    return http.get(`${baseURL}/section/?limit=10&offset=${page}0`, {auth: auth});
};

const getSection = id => {
    return http.get(`${baseURL}/section/${id}`, {auth: auth});
};

const createSection = data => {
    return http.post(`${baseURL}/section/`, {auth: auth, data: data});
};

const updateSection = (id, data) => {
    return http.put(`${baseURL}/section/${id}`, {auth: auth, data: data});
};

const removeSection = id => {
    return http.delete(`${baseURL}/section/${id}`, {auth: auth});
};

const removeAllSection = () => {
    return http.delete(`${baseURL}/section/`, {auth: auth});
};

const findByTitleSection = title => {
    return http.get(`${baseURL}/section?title=${title}`, {auth: auth});
};

export {
    getAll,
    getAllSectionsPagination,
    getSection,
    createSection,
    updateSection,
    removeSection,
    removeAllSection,
    findByTitleSection,
    baseURL,
    auth
};