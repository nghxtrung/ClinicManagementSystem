import React from "react";
import { Menu } from "antd";

const NavigationMenu = ({ items, selectedKey, changeSelectedKey }) => {
    return (
        <Menu theme="dark" mode="inline" items={items} selectedKeys={selectedKey} onClick={changeSelectedKey} className="h-screen" />
    );
}

export default NavigationMenu;