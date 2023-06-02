import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Layout, Spin } from "antd";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import useNotification from "../hooks/useNotification";
import { handleInputData } from "../utils/dataUtils";
import { handleApi } from "../utils/apiUtils";

const Login = () => {
    const [login, setLogin] = useState({
        userName: null,
        password: null
    });
    const [loading, setLoading] = useState(false);
    const [loginNotification, loginNotificationContext] = useNotification();
    const navigate = useNavigate();

    const onFinish = () => {
        handleApi(() => authService.Login(login.userName, login.password), setLoading)
            .then(data => {
                localStorage.setItem('token', data['token']);
                localStorage.setItem('user', JSON.stringify(data['user']));
                navigate("/");
            }).catch(message => {
                loginNotification.error(message);
            });
    }

    return (
        <>
            {loginNotificationContext}
            <Spin spinning={loading}>
                <Layout className="h-screen flex items-center justify-center">
                    <Card bordered={false} style={{ width: 500 }}>
                        <div className="mb-9">
                            <img src="logo.png" alt="logo" className="bg-white"></img>
                        </div>
                        <Layout.Content>
                            <Form onFinish={onFinish}>
                                <Form.Item name="userName">
                                    <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" name="userName" onChange={e => handleInputData(e, login, setLogin)} />
                                </Form.Item>
                                <Form.Item name="password">
                                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" name="password" onChange={e => handleInputData(e, login, setLogin)} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Đăng nhập</Button>
                                </Form.Item>
                            </Form>
                        </Layout.Content>
                    </Card>
                </Layout>
            </Spin>
        </>
    )
}

export default Login;