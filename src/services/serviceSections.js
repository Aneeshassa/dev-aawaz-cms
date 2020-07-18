import http from '../http-common';
import auth from './authentication'
import axios from 'axios'

const baseURL = "https://prod.aawaz.com/api";

const getAll = () => {
    return http.get(`${baseURL}/section/?all=True`, {auth: auth});
};

const getAllSectionsPagination = (page=1) => {
    return http.get(`${baseURL}/section/?page=${page}`, {auth: auth});
};

const getSection = id => {
    return http.get(`${baseURL}/section/${id}/`, {auth: auth});
};

const createSection = data => {
    return axios({
        method: "POST",
      url: `${baseURL}/section/`,
      headers: {
        "Content-Type": "multipart/form-data"
      },
      auth: auth,
      data: data
    })
    // return http.post(`${baseURL}/section/`, {auth: auth}, {data: data});
};

const updateSection = (id, data) => {
    return http.put(`${baseURL}/section/${id}/`, {auth: auth, data: data});
};

const removeSection = id => {
    return http.delete(`${baseURL}/section/${id}/`, {auth: auth});
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