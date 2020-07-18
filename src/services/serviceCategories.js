import http from '../http-common';
import auth from './authentication';

const baseURL = "https://prod.aawaz.com/api";

const getAllCategory = () => {
    return http.get(`${baseURL}/category/?all=True`, {auth: auth});
};

const getCategoryDropDowns = () => {
    return http.get(`${baseURL}/category/?all=True&only_select=True`, {auth: auth});
};
const getAllCategoryPagination = (page=1) => {
    return http.get(`${baseURL}/category/?page=${page}`, {auth: auth});
};

const getCategory = id => {
    return http.get(`${baseURL}/category/${id}/`, {auth: auth});
}

const createCategory = data => {
    return http.post(`${baseURL}/category/`, {auth: auth, data: data});
}

const updateCategory = (id, data) => {
    return http.patch(`${baseURL}/category/${id}/`, data, {auth: auth});
}

const removeCategory = id => {
    return http.delete(`${baseURL}/category/${id}/`, {auth: auth});
}

const removeAllCategory = () => {
    return http.delete(`${baseURL}/category`, {auth: auth});
}

const findByTitleCategory = title => {
    return http.get(`${baseURL}/category?title=${title}`, {auth: auth});
}

export {
    getAllCategory,getCategoryDropDowns, getAllCategoryPagination, getCategory, createCategory, updateCategory, removeCategory, removeAllCategory, findByTitleCategory, baseURL
}