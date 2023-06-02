import axios from "axios"

const getByPatientExaminationCode = (patientExaminationCode) => {
    return axios.get(`/Prescription/GetByPatientExaminationCode?patientExaminationCode=${patientExaminationCode}`);
}

const savePrescription = (prescription) => {
    return axios.post("/Prescription/SavePrescription", prescription);
}

const deletePrescriptionByCode = (code) => {
    return axios.get(`/Prescription/DeletePrescriptionByCode?code=${code}`);
}

const prescriptionService = {
    getByPatientExaminationCode,
    savePrescription,
    deletePrescriptionByCode
}

export default prescriptionService;