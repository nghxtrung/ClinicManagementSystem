import axios from "axios";

const getPatientExaminations = () => {
    return axios.get("/PatientExamination/GetPatientExaminations");
}

const getPatientExaminationByCode = (code) => {
    return axios.get(`/PatientExamination/GetPatientExaminationByCode?code=${code}`);
}

const getPatientExaminationsBasicExamination = () => {
    return axios.get("/PatientExamination/GetPatientExaminationsBasicExamination");
}

const savePatientExamination = (examination) => {
    return axios.post("/PatientExamination/SavePatientExamination", examination);
}

const changeStatusPatientExamination = (code, status) => {
    return axios.get(`/PatientExamination/ChangeStatusPatientExamination?code=${code}&&examinationStatus=${status}`);
}

const deletePatientExaminationByCode = (code) => {
    return axios.get(`/PatientExamination/DeletePatientExaminationByCode?code=${code}`);
}

const patientExaminationService = {
    getPatientExaminations,
    getPatientExaminationByCode,
    getPatientExaminationsBasicExamination,
    savePatientExamination,
    changeStatusPatientExamination,
    deletePatientExaminationByCode
}

export default patientExaminationService;