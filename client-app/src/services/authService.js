import axios from "axios";

const Login = (userName, password) => {
    return axios.post("/Auth/Login", {
        UserName: userName,
        Password: password
    });
}

const LogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

const authService = {
    Login, LogOut
}

export default authService;