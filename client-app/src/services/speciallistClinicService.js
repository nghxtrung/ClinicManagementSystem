import axios from "axios";

const getSpeciallistClinics = () => {
    return axios.get("/SpeciallistClinic/GetSpeciallistClinics");
}

const speciallistClinicService = {
    getSpeciallistClinics
}

export default speciallistClinicService;