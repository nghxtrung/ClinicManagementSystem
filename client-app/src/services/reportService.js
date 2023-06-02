import axios from "axios"

const getPrescriptionReport = (patientExamination) => {
    return axios.get(`/Report/GetPrescriptionReport?patientExamination=${patientExamination}`);
}

const getPatientServiceSubclinicalResultReport = (serviceSubclinicDesignation) => {
    return axios.get(`/Report/getPatientServiceSubclinicalResultReport?serviceSubclinicDesignation=${serviceSubclinicDesignation}`);
}

const reportService = {
    getPrescriptionReport,
    getPatientServiceSubclinicalResultReport
}

export default reportService;