import axios from "axios"

const getByPrescriptionCode = (prescriptionCode) => {
    return axios.get(`/PrescriptionMedicine/GetByPrescriptionCode?prescriptionCode=${prescriptionCode}`);
}

const savePrescriptionMedicine = (prescriptionMedicine) => {
    return axios.post("/PrescriptionMedicine/SavePrescriptionMedicine", prescriptionMedicine);
}

const deletePrescriptionMedicineById = (id) => {
    return axios.get(`/PrescriptionMedicine/DeletePrescriptionMedicineById?id=${id}`);
}

const prescriptionMedicineService = {
    getByPrescriptionCode,
    savePrescriptionMedicine,
    deletePrescriptionMedicineById
}

export default prescriptionMedicineService;