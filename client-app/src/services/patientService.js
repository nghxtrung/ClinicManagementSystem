import axios from "axios"

const getPatients = () => {
    return axios.get("/Patient/GetPatients");
}

const getPatientsByFilter = (filter) => {
    return axios.get(`/Patient/GetPatientsByFilter?filter=${filter}`);
}

const savePatient = (patient) => {
    return axios.post("/Patient/SavePatient", patient);
}

const patientService = {
    getPatients,
    getPatientsByFilter,
    savePatient
}

export default patientService;