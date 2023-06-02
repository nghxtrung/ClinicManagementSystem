import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import NavigationDrawer from "./NavigationDrawer";
import NavigationMenu from "./NavigationMenu";
import { Layout } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HomeOutlined } from "@ant-design/icons";

const AppLayout = ({ children }) => {
    const [menuItems, setMenuItems] = useState([]);
    useEffect(() => {
        const role = JSON.parse(localStorage.getItem('user'))['role'];
        switch (role) {
            case 0:
                setMenuItems([
                    { key: '/', label: 'Màn hình chính', icon: <HomeOutlined /> },
                    { key: '/PatientReception', label: 'Tiếp nhận bệnh nhân', icon: <FontAwesomeIcon icon="fa-solid fa-book-medical" /> },
                    { key: '/Examination', label: 'Khám bệnh', icon: <FontAwesomeIcon icon="fa-solid fa-stethoscope" /> },
                    { key: '/ImagingDiagnostic', label: 'Chẩn đoán hình ảnh', icon: <FontAwesomeIcon icon="fa-solid fa-x-ray" /> },
                    { key: '/ServicePayment', label: 'Thu tiền dịch vụ', icon: <FontAwesomeIcon icon="fa-solid fa-money-bill" /> },
                    {
                        key: '/Category', label: 'Quản lý danh mục', icon: <FontAwesomeIcon icon="fa-solid fa-list" />, children: [
                            { key: '/User', label: 'Quản lý người dùng', icon: <FontAwesomeIcon icon="fa-solid fa-hospital-user" /> },
                            { key: '/Medicine', label: 'Quản lý thuốc', icon: <FontAwesomeIcon icon="fa-solid fa-pills" /> },
                        ]
                    }
                ]);
                break;
            case 1:
                setMenuItems([
                    { key: '/', label: 'Màn hình chính', icon: <HomeOutlined /> },
                    { key: '/Examination', label: 'Khám bệnh', icon: <FontAwesomeIcon icon="fa-solid fa-stethoscope" /> },
                    { key: '/ImagingDiagnostic', label: 'Chẩn đoán hình ảnh', icon: <FontAwesomeIcon icon="fa-solid fa-x-ray" /> }
                ]);
                break;
            case 2:
                setMenuItems([
                    { key: '/', label: 'Màn hình chính', icon: <HomeOutlined /> },
                    { key: '/PatientReception', label: 'Tiếp nhận bệnh nhân', icon: <FontAwesomeIcon icon="fa-solid fa-book-medical" /> },
                    { key: '/ServicePayment', label: 'Thu tiền dịch vụ', icon: <FontAwesomeIcon icon="fa-solid fa-money-bill" /> }
                ]);
                break;
            default:
                setMenuItems([]);
        }
    }, []);

    const location = useLocation();
    const navigate = useNavigate();

    const [selectedKey, setSelectedKey] = useState(location.pathname);
    const changeSelectedKey = ({ key }) => {
        navigate(key);
        setSelectedKey(key);
    }

    const navigationMenu = (
        <NavigationMenu items={menuItems} selectedKey={selectedKey} changeSelectedKey={changeSelectedKey} />
    );

    return (
        <Layout hasSider>
            <Sidebar navigationMenu={navigationMenu} />
            <Layout>
                <NavigationDrawer navigationMenu={navigationMenu} />
                <Layout.Content className="h-screen p-3">
                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    )
}

export default AppLayout;