import axios from "axios"

const getDiagnoses = () => {
    return axios.get("/Diagnose/getDiagnoses");
}

const diagnoseService = {
    getDiagnoses
}

export default diagnoseService;