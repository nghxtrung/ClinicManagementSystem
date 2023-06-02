import axios from "axios";

const getByPatientExaminationCode = (code) => {
    return axios.get(`/ServiceSubclinicDesignation/GetByPatientExaminationCode?patientExaminationCode=${code}`);
}

const saveServiceSubclinicDesignation = (serviceSubclinicDesignation) => {
    return axios.post("/ServiceSubclinicDesignation/SaveServiceSubclinicDesignation", serviceSubclinicDesignation);
}

const deleteServiceSubclinicDesignationById = (id) => {
    return axios.get(`/ServiceSubclinicDesignation/DeleteServiceSubclinicDesignationById?id=${id}`);
}

const getServiceSubclinicDesignations = () => {
    return axios.get("/ServiceSubclinicDesignation/GetServiceSubclinicDesignations");
}

const changeStatusServiceSubclinicDesignation = (code, status) => {
    return axios.get(`/ServiceSubclinicDesignation/ChangeStatusServiceSubclinicDesignation?code=${code}&&examinationStatus=${status}`);
}

const updateServiceSubclinicDesignation = (formData) => {
    return axios.post("/ServiceSubclinicDesignation/UpdateServiceSubclinicDesignation", formData);
}

const getServiceSubclinicDesignationByCode = (code) => {
    return axios.get(`/ServiceSubclinicDesignation/GetServiceSubclinicDesignationByCode?code=${code}`);
}

const serviceSubclinicDesignationService = {
    getByPatientExaminationCode,
    saveServiceSubclinicDesignation,
    deleteServiceSubclinicDesignationById,
    getServiceSubclinicDesignations,
    changeStatusServiceSubclinicDesignation,
    updateServiceSubclinicDesignation,
    getServiceSubclinicDesignationByCode
}

export default serviceSubclinicDesignationService;