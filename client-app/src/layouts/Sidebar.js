import React, { useState } from "react";
import { Button, Layout } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const Sidebar = ({ navigationMenu }) => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    return (
        <Layout.Sider
            theme="dark"
            collapsed={collapsed}
            className="hidden lg:block"
            width="300"
        >
            <div className="bg-white h-20 flex items-center justify-center shadow-md">
                <Button type="text" onClick={toggleCollapsed}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
                <a href="/" className={collapsed ? "hidden" : ""}>
                    <img src="logo.png" className="bg-white h-20" alt="logo"></img>
                </a>
            </div>
            {navigationMenu}
        </Layout.Sider>
    );
}

export default Sidebar;