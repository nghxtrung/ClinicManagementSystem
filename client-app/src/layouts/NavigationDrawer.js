import React, { useState } from "react";
import { Drawer, Layout, theme, Button, Space, Dropdown } from "antd";
import { DownOutlined, MenuOutlined } from '@ant-design/icons';
import authService from "../services/authService";

const NavigationDrawer = ({ navigationMenu }) => {
    const [open, setOpen] = useState(false);
    const {
        token: { colorBgContainer }
    } = theme.useToken();
    const displayName = JSON.parse(localStorage.getItem('user'))['displayName'];

    const items = [
        {
            label: <a href="/">Đổi mật khẩu</a>,
            key: '0',
        },
        {
            label: <a href="/Login" onClick={authService.LogOut}>Đăng xuất</a>,
            key: '1',
        },
    ];

    return (
        <>
            <Drawer
                placement="left"
                open={open}
                onClick={() => setOpen(false)}
                onClose={() => setOpen(false)}
                closable={false}
                width={300}
                bodyStyle={{
                    padding: 0,
                    overflow: "hidden",
                }}
            >
                <div className="bg-white flex items-center justify-center shadow-md">
                    <a href="/">
                        <img src="logo.png" className="bg-white h-20" alt="logo"></img>
                    </a>
                </div>
                {navigationMenu}
            </Drawer>
            <Layout.Header className="shadow-md h-20 flex items-center px-4 justify-between lg:justify-end" style={{ background: colorBgContainer }}>
                <Button
                    className="lg:hidden"
                    type="text"
                    icon={<MenuOutlined />}
                    onClick={() => setOpen(!open)}
                />
                <Space>
                    <Dropdown
                        menu={{
                            items,
                        }}
                        trigger={['click']}
                    >
                        <a href="/">
                            <Space>
                                {displayName}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </Space>
            </Layout.Header>
        </>
    );
}

export default NavigationDrawer;