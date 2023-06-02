import { Card, Statistic } from "antd";
import React from "react";

const StatisticCard = ({ title, value, icon, backgroundClassName, }) => {
    return (
        <Card bordered className={backgroundClassName}>
            <span className="text-white text-xl">{title}</span>
            <Statistic valueStyle={{ color: 'white', fontWeight: 700 }} value={value} prefix={icon} />
        </Card>
    );
}

export default StatisticCard;