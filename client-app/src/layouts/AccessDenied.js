import { Button, Empty } from "antd";
import React from "react";
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
    const navigate = useNavigate();
    return (
        <Empty
            image="lock.png"
            description={
                <>
                    <h1>Không có quyền truy cập</h1>
                    <p className="text-base">Bạn không có quyền truy cập vào trang này.</p>
                    <p className="text-base">Vui lòng liên hệ quản trị viên để được cấp quyền hoặc truy cập về trang chủ và các trang khác.</p>
                </>
            }
            className="flex justify-center items-center flex-col h-screen bg-gray-100"
        >
            <Button icon={<HomeOutlined />} type="primary" danger onClick={() => navigate("/")}>Trở về trang chủ</Button>
        </Empty>
    );
}

export default AccessDenied;