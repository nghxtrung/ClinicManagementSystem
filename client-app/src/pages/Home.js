import { Card, Col, Divider, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import ColumnChart from "../components/ColumnChart";
import PieChart from "../components/PieChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleApi } from "../utils/apiUtils";
import statisticService from "../services/statisticService";
import StatisticCard from "../components/StatisticCard";

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [patientExaminationStatus, setPatientExaminationStatus] = useState({
        received: 0,
        incomplete: 0,
        waiting: 0,
        completed: 0
    });
    const [diagnoseTotalCount, setDiagnoseTotalCount] = useState([]);
    const [serviceTypeTotalPrice, setServiceTypeTotalPrice] = useState([]);
    useEffect(() => {
        handleApi(() => statisticService.getPatientExaminationStatusStatistics(), setLoading)
            .then(data => setPatientExaminationStatus(data));
        handleApi(() => statisticService.getDiagnoseTotalCountStatistics(), setLoading)
            .then(data => setDiagnoseTotalCount(data));
        handleApi(() => statisticService.getServiceTypeTotalPriceStatistics(), setLoading)
            .then(data => setServiceTypeTotalPrice(data));
    }, []);

    return (
        <Spin spinning={loading}>
            <Row gutter={[8, 8]}>
                <Col span={6}>
                    <StatisticCard
                        title="Tiếp nhận"
                        value={patientExaminationStatus.received}
                        icon={<FontAwesomeIcon icon="fa-solid fa-right-to-bracket" />}
                        backgroundClassName="bg-gradient-to-r from-blue-400 to-blue-600" />
                </Col>
                <Col span={6}>
                    <StatisticCard
                        title="Chưa khám"
                        value={patientExaminationStatus.incomplete}
                        icon={<FontAwesomeIcon icon="fa-solid fa-clock" />}
                        backgroundClassName="bg-gradient-to-r from-red-400 to-red-600" />
                </Col>
                <Col span={6}>
                    <StatisticCard
                        title="Chờ kết quả"
                        value={patientExaminationStatus.waiting}
                        icon={<FontAwesomeIcon icon="fa-solid fa-stethoscope" />}
                        backgroundClassName="bg-gradient-to-r from-orange-400 to-orange-600" />
                </Col>
                <Col span={6}>
                    <StatisticCard
                        title="Đã khám"
                        value={patientExaminationStatus.completed}
                        icon={<FontAwesomeIcon icon="fa-solid fa-clipboard-check" />}
                        backgroundClassName="bg-gradient-to-r from-green-400 to-green-600" />
                </Col>
                <Col span={14}>
                    <Card className="text-center">
                        <span className="text-2xl">Biểu đồ số lượng ICD</span>
                        <Divider />
                        <ColumnChart data={diagnoseTotalCount} xField="code" yField="totalCount" />
                    </Card>
                </Col>
                <Col span={10}>
                    <Card className="text-center">
                        <span className="text-2xl">Thống kê viện phí</span>
                        <Divider />
                        <PieChart data={serviceTypeTotalPrice} labelField="serviceType" valueField="totalPrice" />
                    </Card>
                </Col>
            </Row>
        </Spin>
    );
}

export default Home;