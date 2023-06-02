import { Pie } from "@ant-design/plots";
import React from "react";

const PieChart = ({ data, labelField, valueField }) => {
    const config = {
        data: data,
        angleField: valueField,
        colorField: labelField,
        radius: 0.75,
    };
    return <Pie {...config} />
}

export default PieChart;