import http from '../http-common';
import auth from './authentication';

const baseURL = "https://prod.aawaz.com/api";

const getAllShow = () => {
    return http.get(`${baseURL}/shows/?all=True`,{auth: auth});
};

const getShowsDropDowns = () => {
    return http.get(`${baseURL}/shows/?all=true&only_select=True`,{auth: auth});
};

const getAllShowPaginate = (page=1)=>{
    return http.get(`${baseURL}/shows/?page=${page}`,{auth: auth});
}

const getShow = id => {
    return http.get(`${baseURL}/shows/${id}`,{auth: auth});
}

const createShow = data => {
    return http.post(`${baseURL}/shows/`, {auth: auth, data: data});
}

const updateShow = (id, data) => {
    return http.patch(`${baseURL}/shows/${id}/`,{data: data}, {auth: auth});
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
    getShowsDropDowns,
    baseURL
};
