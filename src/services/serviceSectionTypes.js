import http from '../http-common';
import auth from './authentication'

const baseURL = "https://prod.aawaz.com/api";

const getAllSectionTypes = () => {
    return http.get(`${baseURL}/sectiontype/?limit=100`, {auth: auth});
};

const getAllSectionTypesPagination = (page=0) => {
    return http.get(`${baseURL}/sectiontype/?limit=10&offset=${page}0`, {auth: auth});
};


const createSectionTypes = data => {
    return http.post(`${baseURL}/sectiontype/`, {auth: auth, data: data});
};

const updateSectionTypes = (id, data) => {
    return http.put(`${baseURL}/sectiontype/${id}/`, {auth: auth, data: data});
};

export {
    getAllSectionTypes,
    getAllSectionTypesPagination,
    createSectionTypes,
    updateSectionTypes,
    baseURL,
    auth
};