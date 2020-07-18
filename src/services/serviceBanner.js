import http from '../http-common';
import auth from './authentication';

const baseURL = "https://prod.aawaz.com/api";

const getAllBanner = () => {
    return http.get(`${baseURL}/banners/?limit=100`, {auth: auth});
};

const getBannerDropDown = () => {
    return http.get(`${baseURL}/banners/?all=True&only_select=True`, {auth: auth});
};

const getBanner = id => {
    return http.get(`${baseURL}/banners/${id}`, {auth: auth});
}

const createBanner = data => {
    return http.post(`${baseURL}/banners`, {auth: auth, data:data});
}

const updateBanner = (id, data) => {
    return http.patch(`${baseURL}/banners/${id}/`, {auth: auth, data:data});
}

const removeBanner = id => {
    return http.delete(`${baseURL}/banners/${id}`, {auth: auth});
}

const removeAllBanner = () => {
    return http.delete(`${baseURL}/banners`, {auth: auth});
}

const findByTitleBanner = title => {
    return http.get(`${baseURL}/banners?title=${title}`, {auth: auth});
}

export  {
    getAllBanner,
    getBannerDropDown,
    getBanner,
    createBanner,
    updateBanner,
    removeBanner,
    removeAllBanner,
    findByTitleBanner,
    baseURL
};
