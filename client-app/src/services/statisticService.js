import axios from "axios";

const getPatientExaminationStatusStatistics = () => {
    return axios.get("/Statistic/GetPatientExaminationStatusStatistics");
}

const getServiceTypeTotalPriceStatistics = () => {
    return axios.get("/Statistic/GetServiceTypeTotalPriceStatistics");
}

const getSpeciallistClinicStatusStatistics = () => {
    return axios.get("/Statistic/GetSpeciallistClinicStatusStatistics");
}

const getDiagnoseTotalCountStatistics = () => {
    return axios.get("/Statistic/GetDiagnoseTotalCountStatistics");
}

const statisticService = {
    getPatientExaminationStatusStatistics,
    getServiceTypeTotalPriceStatistics,
    getSpeciallistClinicStatusStatistics,
    getDiagnoseTotalCountStatistics
}

export default statisticService;