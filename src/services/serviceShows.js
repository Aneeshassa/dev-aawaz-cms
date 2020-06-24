import http from '../http-common';
import auth from './authentication';

const baseURL = "https://staging.samortech.com/api";

const getAllShow = () => {
    return http.get(`${baseURL}/shows/?limit=100`,{auth: auth});
};

const getAllShowPaginate = (currentPage = 0)=>{
    return http.get(`${baseURL}/shows/?limit=10&offset=${currentPage}0`,{auth: auth});
}

const getShow = id => {
    return http.get(`${baseURL}/shows/${id}`,{auth: auth});
}

const createShow = data => {
    return http.post(`${baseURL}/shows/`, {auth: auth, data: data});
}

const updateShow = (id, data) => {
    return http.patch(`${baseURL}/shows/${id}/`,{auth: auth, data: data});
}

const removeShow = id => {
    return http.delete(`${baseURL}/shows/${id}`, {auth: auth});
}

const removeAllShow = () => {
    return http.delete(`${baseURL}/shows`, {auth: auth});
}

const findByTitleShow = title => {
    return http.get(`${baseURL}/shows?title=${title}`, {auth: auth});
}

export  {
    getAllShow,
    getAllShowPaginate,
    getShow,
    createShow,
    updateShow,
    removeShow,
    removeAllShow,
    findByTitleShow,
    baseURL
};
