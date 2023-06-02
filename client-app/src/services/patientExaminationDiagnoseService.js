import axios from "axios"

const getByPatientExaminationCode = (patientExaminationCode) => {
    return axios.get(`/PatientExaminationDiagnose/GetByPatientExaminationCode?patientExaminationCode=${patientExaminationCode}`);
}

const savePatientExaminationDiagnose = (patientExaminationDiagnose) => {
    return axios.post("/PatientExaminationDiagnose/SavePatientExaminationDiagnose", patientExaminationDiagnose);
}

const patientExaminationDiagnoseService = {
    getByPatientExaminationCode,
    savePatientExaminationDiagnose
}

export default patientExaminationDiagnoseService;