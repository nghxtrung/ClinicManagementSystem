import React from "react";
import Login from "./pages/Login";
import AuthenticatedOutlet from "./layouts/AuthenticatedOutlet";
import { Route, Routes } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import Home from "./pages/Home";
import PatientReception from "./pages/PatientReception";
import Examination from "./pages/Examination";
import axios from "axios";
import ServicePayment from "./pages/ServicePayment";
import User from "./pages/User";
import ImagingDiagnostic from "./pages/ImagingDiagnostic";
import { USERROLE } from "./constants/optionConstant";
import AccessDeniedOutlet from "./layouts/AccessDeniedOutlet";
import Medicine from "./pages/Medicine";

function App() {
  library.add(fas, far);
  axios.defaults.baseURL = 'https://localhost:44332/api';
  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token !== null && token !== undefined && token.trim() !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  });
  return (
    <Routes>
      <Route element={<AccessDeniedOutlet />}>
        <Route path="/Login" element={<Login />} />
      </Route>
      <Route element={<AuthenticatedOutlet roles={[USERROLE['Quản trị'], USERROLE['Bác sĩ'], USERROLE['Lễ tân']]} />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route element={<AuthenticatedOutlet roles={[USERROLE['Quản trị'], USERROLE['Bác sĩ']]} />}>
        <Route path="/Examination" element={<Examination />} />
        <Route path="/ImagingDiagnostic" element={<ImagingDiagnostic />} />
      </Route>
      <Route element={<AuthenticatedOutlet roles={[USERROLE['Quản trị'], USERROLE['Lễ tân']]} />}>
        <Route path="/PatientReception" element={<PatientReception />} />
        <Route path="/ServicePayment" element={<ServicePayment />} />
      </Route>
      <Route element={<AuthenticatedOutlet roles={[USERROLE['Quản trị']]} />}>
        <Route path="/User" element={<User />} />
        <Route path="/Medicine" element={<Medicine />} />
      </Route>
    </Routes>
  );
}

export default App;
