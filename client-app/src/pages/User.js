import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Form, Input, Row, Select, Space, Spin, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { handleApi } from "../utils/apiUtils";
import userService from "../services/userService";
import useNotification from "../hooks/useNotification";
import { GetKeyObject, handleInputData, handleInputSelect } from "../utils/dataUtils";
import { USERROLE, USERROLEOPTION } from "../constants/optionConstant";

const User = () => {
    const [notification, notificationContext] = useNotification();
    const [loading, setLoading] = useState(false);
    const emptyUser = {
        UserName: null,
        DisplayName: null,
        Email: null,
        Role: null
    }
    const [user, setUser] = useState(emptyUser);
    const [users, setUsers] = useState([]);
    const [loadIndex, setLoadIndex] = useState(0);
    const [userKeySelected, setUserKeySelected] = useState(null);
    const userColumns = [
        {
            title: 'Hành động',
            render: (user) => (
                <Space>
                    <Button icon={<CheckOutlined />} type="primary" onClick={() => edit(user)}></Button>
                    <Button icon={<DeleteOutlined />} type="primary" danger onClick={() => remove(user['key'])}></Button>
                    <Button icon={<FontAwesomeIcon icon="fa-solid fa-key" />} onClick={() => resetPassword(user['key'])}></Button>
                </Space>
            )
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'UserName'
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'DisplayName'
        },
        {
            title: 'Email',
            dataIndex: 'Email'
        },
        {
            title: 'Chức danh',
            dataIndex: 'Role',
            render: (_, { Role }) => {
                const roleName = GetKeyObject(USERROLE, Role);
                switch (Role) {
                    case USERROLE['Quản trị']:
                        return <Tag color="green">{roleName}</Tag>
                    case USERROLE['Bác sĩ']:
                        return <Tag color="blue">{roleName}</Tag>
                    case USERROLE['Lễ tân']:
                        return <Tag color="purple">{roleName}</Tag>
                    default:
                        return <></>
                }
            }
        }
    ];

    const edit = (user) => {
        setUserKeySelected(user['key']);
        setUser({
            UserName: user['UserName'],
            DisplayName: user['DisplayName'],
            Email: user['Email'],
            Role: user['Role'],
        });
    }

    const save = () => {
        handleApi(() => userService.saveUser(user), setLoading)
            .then(() => {
                setLoadIndex(loadIndex + 1);
                notification.success("Lưu thông tin người dùng thành công!");
            })
            .catch(message => {
                notification.error(message);
            });
    }

    const remove = (userName) => {
        handleApi(() => userService.deleteUser(userName), setLoading)
            .then(() => {
                setLoadIndex(loadIndex + 1);
                notification.success("Xoá thông tin người dùng thành công!");
            })
            .catch(message => {
                notification.error(message);
            });
    }

    const resetPassword = (userName) => {
        handleApi(() => userService.resetPasswordUser(userName), setLoading)
            .then(() => {
                setLoadIndex(loadIndex + 1);
                notification.success("Reset mật khẩu người dùng thành công!");
            })
            .catch(message => {
                notification.error(message);
            });
    }

    useEffect(() => {
        handleApi(() => userService.getUsers(), setLoading)
            .then(data => {
                setUsers(data.map(item => ({
                    key: item['userName'],
                    UserName: item['userName'],
                    DisplayName: item['displayName'],
                    Email: item['email'],
                    Role: item['role']
                })));
            });
    }, [loadIndex]);

    return (
        <Spin spinning={loading}>
            {notificationContext}
            <Row>
                <Col span={24}>
                    <Card title="Danh sách người dùng">
                        <Form>
                            <Row gutter={[8, 0]}>
                                <Col span={5}>
                                    <Form.Item label="Tên đăng nhập">
                                        <Input
                                            value={user.UserName}
                                            name="UserName"
                                            onChange={e => handleInputData(e, user, setUser)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <Form.Item label="Tên hiển thị">
                                        <Input
                                            value={user.DisplayName}
                                            name="DisplayName"
                                            onChange={e => handleInputData(e, user, setUser)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <Form.Item label="Email">
                                        <Input
                                            value={user.Email}
                                            name="Email"
                                            onChange={e => handleInputData(e, user, setUser)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <Form.Item label="Chức danh">
                                        <Select
                                            value={user.Role}
                                            options={USERROLEOPTION}
                                            onChange={value => handleInputSelect(value, user, setUser, "Role")}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item>
                                        <Space>
                                            <Button onClick={() => setUser(emptyUser)}>Thêm mới</Button>
                                            <Button onClick={save}>Lưu</Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            columns={userColumns}
                            dataSource={users}
                            rowClassName={(user) => user['key'] === userKeySelected ? 'bg-blue-100' : ''}
                        />
                    </Card>
                </Col>
            </Row>
        </Spin>
    );
}

export default User;