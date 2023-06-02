import { Column } from "@ant-design/plots";
import React from "react";

const ColumnChart = ({ data, xField, yField }) => {
    const config = {
        data: data,
        xField: xField,
        yField: yField,
        seriesField: xField,
        legend: true,
    };
    return <Column {...config} />
}

export default ColumnChart;