import axios from "axios";

const getUsers = () => {
    return axios.get("/User/GetUsers");
}

const saveUser = (user) => {
    return axios.post("/User/SaveUser", user);
}

const deleteUser = (userName) => {
    return axios.get(`/User/DeleteUser?userName=${userName}`);
}

const resetPasswordUser = (userName) => {
    return axios.get(`/User/ResetPasswordUser?userName=${userName}`);
}

const userService = {
    getUsers,
    saveUser,
    deleteUser,
    resetPasswordUser
}

export default userService;