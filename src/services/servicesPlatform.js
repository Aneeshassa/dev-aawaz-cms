import http from '../http-common'
import auth from './authentication'

const baseURL = "https://staging.samortech.com/api";

const getAllPlatform = () => {
    return http.get(`${baseURL}/platforms/?limit=200`, {auth: auth});
};

const getPlatform = id => {
    return http.get(`${baseURL}/platforms/${id}/`, {auth: auth});
}

const createPlatform = data => {
            return http.post(`${baseURL}/platforms/`, {auth: auth, data: data});
}

const updatePlatform = (id, data) => {
    return http.patch(`${baseURL}/platforms/${id}/`, {auth: auth, data: data});
}

const removePlatform = id => {
    return http.delete(`${baseURL}/platforms/${id}`, {auth: auth});
}


export {
    getAllPlatform, getPlatform, createPlatform, updatePlatform, removePlatform, baseURL
}