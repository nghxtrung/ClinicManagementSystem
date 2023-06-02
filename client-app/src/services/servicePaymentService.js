import axios from "axios"

const getBasicExaminationByPatientExaminationCode = (patientExaminationCode) => {
    return axios.get(`/ServicePayment/GetBasicExaminationByPatientExaminationCode?patientExaminationCode=${patientExaminationCode}`);
}

const getByPatientExaminationCode = (patientExaminationCode) => {
    return axios.get(`/ServicePayment/GetByPatientExaminationCode?patientExaminationCode=${patientExaminationCode}`);
}

const saveServicePayment = (servicePayment) => {
    return axios.post("/ServicePayment/SaveServicePayment", servicePayment);
}

const updateServicePaymentStatus = (servicePayment) => {
    return axios.post("/ServicePayment/UpdateServicePaymentStatus", servicePayment);
}

const servicePaymentService = {
    getBasicExaminationByPatientExaminationCode,
    getByPatientExaminationCode,
    updateServicePaymentStatus,
    saveServicePayment
}

export default servicePaymentService;