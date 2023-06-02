import axios from "axios"

const getMedicines = () => {
    return axios.get("/Medicine/GetMedicines");
}

const getMedicineById = (id) => {
    return axios.get(`/Medicine/GetMedicineById?id=${id}`);
}

const saveMedicine = (medicine) => {
    return axios.post("/Medicine/SaveMedicine", medicine);
}

const deleteMedicine = (id) => {
    return axios.delete(`/Medicine/DeleteMedicine?id=${id}`);
}

const medicineService = {
    getMedicines,
    getMedicineById,
    saveMedicine,
    deleteMedicine
}

export default medicineService;