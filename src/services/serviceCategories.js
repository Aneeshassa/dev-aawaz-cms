import http from '../http-common';
import auth from './authentication';

const baseURL = "https://staging.samortech.com/api";

const getAllCategory = () => {
    return http.get(`${baseURL}/category/?limit=100`, {auth: auth});
};

const getCategory = id => {
    return http.get(`${baseURL}/category/${id}`, {auth: auth});
}

const createCategory = data => {
    return http.post(`${baseURL}/category`, {auth: auth, data: data});
}

const updateCategory = (id, data) => {
    return http.patch(`${baseURL}/category/${id}/`, {auth: auth, data: data});
}

const removeCategory = id => {
    return http.delete(`${baseURL}/category/${id}`, {auth: auth});
}

const removeAllCategory = () => {
    return http.delete(`${baseURL}/category`, {auth: auth});
}

const findByTitleCategory = title => {
    return http.get(`${baseURL}/category?title=${title}`, {auth: auth});
}

export {
    getAllCategory, getCategory, createCategory, updateCategory, removeCategory, removeAllCategory, findByTitleCategory, baseURL
}