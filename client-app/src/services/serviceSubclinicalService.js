import axios from "axios"

const getsBySpeciallistClinicCode = (speciallistClinicCode) => {
    return axios.get(`/ServiceSubclinical/GetsBySpeciallistClinicCode?speciallistClinicCode=${speciallistClinicCode}`);
}

const getServiceSubclinicalsByType = (serviceType) => {
    return axios.get(`/ServiceSubclinical/GetServiceSubclinicalsByType?serviceType=${serviceType}`);
}

const serviceSubclinicalService = {
    getsBySpeciallistClinicCode,
    getServiceSubclinicalsByType
}

export default serviceSubclinicalService;