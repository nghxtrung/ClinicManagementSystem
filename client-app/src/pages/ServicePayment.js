import { Button, Card, Col, Form, Input, Row, Space, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { handleApi } from "../utils/apiUtils";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import patientExaminationService from "../services/patientExaminationService";
import servicePaymentService from "../services/servicePaymentService";
import { SERVICEPAYMENTSTATUS } from "../constants/optionConstant";
import { GetKeyObject } from "../utils/dataUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useNotification from "../hooks/useNotification";

const ServicePayment = () => {
    const [servicePaymentNotification, servicePaymentNotificationContext] = useNotification();
    const emptyPatient = {
        Code: null,
        Name: null,
        DateOfBirth: null,
        Sex: null,
        PhoneNumber: null,
        Address: null
    }
    const [patientExaminationCodeSelected, setPatientExaminationCodeSelected] = useState(null);
    const [patient, setPatient] = useState(emptyPatient);
    const patientExaminationsColumns = [
        {
            title: 'Chọn',
            align: 'center',
            render: (patientExamination) => <Button icon={<CheckOutlined />} type="primary" onClick={() => selectPatientExamination(patientExamination)}></Button>
        },
        {
            title: 'Ngày',
            dataIndex: 'dateIn',
            render: (_, { dateIn }) => dayjs(dateIn).format("DD/MM/YYYY")
        },
        {
            title: 'Mã phiếu khám',
            dataIndex: 'code'
        },
        {
            title: 'Tên bệnh nhân',
            dataIndex: 'patientName'
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            render: (_, { dateOfBirth }) => dayjs(dateOfBirth).format("DD/MM/YYYY")
        },
    ];
    const [patientExaminations, setPatientExaminations] = useState([]);
    const selectPatientExamination = (patientExamination) => {
        setPatientExaminationCodeSelected(patientExamination['code']);
        setPatient({
            Code: patientExamination['patientCode'],
            Name: patientExamination['patientName'],
            DateOfBirth: patientExamination['dateOfBirth'],
            Sex: patientExamination['sex'],
            PhoneNumber: patientExamination['phoneNumber'],
            Address: patientExamination['address']
        });
        handleApi(() => servicePaymentService.getByPatientExaminationCode(patientExamination['code']))
            .then(data => {
                setServicePayments(data.map(item => ({
                    key: item['id'],
                    id: item['id'],
                    patientExaminationCode: item['patientExamination']['code'],
                    serviceSubclinicalId: item['serviceSubclinical']['id'],
                    serviceSubclinicalName: item['serviceSubclinical']['name'],
                    price: item['serviceSubclinical']['price'],
                    status: item['status']
                })));
                let total = 0;
                data.forEach(item => {
                    if (item['status'] < 2)
                        total += item['serviceSubclinical']['price'];
                });
                setTotalPrice(total);
            });
    }

    const updateServicePaymentStatus = (serviceSubclinical, status) => {
        let servicePaymentDTO = {
            Id: serviceSubclinical['key'],
            PatientExaminationCode: serviceSubclinical['patientExaminationCode'],
            ServiceSubclinicalId: serviceSubclinical['serviceSubclinicalId'],
            Price: serviceSubclinical['price'],
            Status: status
        }
        new Promise((resolve) => {
            handleApi(() => servicePaymentService.updateServicePaymentStatus(servicePaymentDTO))
                .then(() => resolve())
                .catch(message => {
                    servicePaymentNotification.error(message);
                });
        }).then(() => {
            handleApi(() => servicePaymentService.getByPatientExaminationCode(servicePaymentDTO.PatientExaminationCode))
                .then(data => {
                    setServicePayments(data.map(item => ({
                        key: item['id'],
                        id: item['id'],
                        patientExaminationCode: item['patientExamination']['code'],
                        serviceSubclinicalId: item['serviceSubclinical']['id'],
                        serviceSubclinicalName: item['serviceSubclinical']['name'],
                        price: item['serviceSubclinical']['price'],
                        status: item['status']
                    })));
                    let total = 0;
                    data.forEach(item => {
                        if (item['status'] < 2)
                            total += item['serviceSubclinical']['price'];
                    });
                    setTotalPrice(total);
                    if (status === 1) {
                        servicePaymentNotification.success("Thanh toán thành công!");
                    } else if (status === 2) {
                        servicePaymentNotification.success("Huỷ thành công!");
                    }
                }).catch(message => {
                    servicePaymentNotification.error(message);
                });
        })
    }

    const serviceSubclinicalColumns = [
        {
            title: 'Hành động',
            align: 'center',
            render: (serviceSubclinical) => (
                <Space>
                    <Button disabled={serviceSubclinical['status'] === 1 || serviceSubclinical['status'] === 2} icon={<FontAwesomeIcon icon="fa-solid fa-credit-card" />} type="primary" onClick={() => updateServicePaymentStatus(serviceSubclinical, 1)}></Button>
                    <Button disabled={serviceSubclinical['status'] === 1 || serviceSubclinical['status'] === 2} icon={<FontAwesomeIcon icon="fa-solid fa-xmark" />} type="primary" danger onClick={() => updateServicePaymentStatus(serviceSubclinical, 2)}></Button>
                </Space>
            )
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'serviceSubclinicalName'
        },
        {
            title: 'Giá',
            dataIndex: 'price'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (_, { status }) => {
                const statusName = GetKeyObject(SERVICEPAYMENTSTATUS, status);
                switch (status) {
                    case SERVICEPAYMENTSTATUS['Chưa thanh toán']:
                        return <Tag color="warning">{statusName}</Tag>
                    case SERVICEPAYMENTSTATUS['Đã thanh toán']:
                        return <Tag color="success">{statusName}</Tag>
                    case SERVICEPAYMENTSTATUS['Huỷ']:
                        return <Tag color="error">{statusName}</Tag>
                    default:
                        return <></>
                }
            }
        }
    ]
    const [servicePayments, setServicePayments] = useState([]);
    const [totalPrice, setTotalPrice] = useState(null);

    useEffect(() => {
        handleApi(() => patientExaminationService.getPatientExaminations())
            .then(data => {
                setPatientExaminations(data.map(item => ({
                    key: item['code'],
                    code: item['code'],
                    dateIn: item['dateIn'],
                    patientCode: item['patient']['code'],
                    patientName: item['patient']['name'],
                    dateOfBirth: item['patient']['dateOfBirth'],
                    sex: item['patient']['sex'],
                    phoneNumber: item['patient']['phoneNumber'],
                    address: item['patient']['address'],
                    speciallistClinicName: item['speciallistClinic']['name']
                })));
            });
    }, []);

    return (
        <>
            {servicePaymentNotificationContext}
            <Row gutter={[8, 0]}>
                <Col span={10}>
                    <Card title="Danh sách phiếu khám">
                        <Table
                            columns={patientExaminationsColumns}
                            dataSource={patientExaminations}
                            pagination={false}
                            bordered
                            rowClassName={(patientExamination) => patientExamination['code'] === patientExaminationCodeSelected ? 'bg-blue-100' : ''}
                        />
                    </Card>
                </Col>
                <Col span={14}>
                    <Row gutter={[0, 8]}>
                        <Col span={24}>
                            <Card title="Thông tin bệnh nhân">
                                <Form>
                                    <Row gutter={[8, 0]}>
                                        <Col span={10}>
                                            <Form.Item label="Mã bệnh nhân">
                                                <Input readOnly value={patient.Code} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <Form.Item label="Tên Bệnh nhân">
                                                <Input readOnly value={patient.Name} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[8, 0]}>
                                        <Col span={5}>
                                            <Form.Item label="Ngày sinh">
                                                <Input readOnly value={patient.DateOfBirth !== null ? dayjs(patient.DateOfBirth).format("DD/MM/YYYY") : null} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
                                            <Form.Item label="Giới tính">
                                                <Input readOnly value={patient.Sex !== null ? (patient.Sex === true ? "Nam" : "Nữ") : null} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <Form.Item label="Điện thoại">
                                                <Input readOnly value={patient.PhoneNumber} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item label="Địa chỉ">
                                                <Input readOnly value={patient.Address} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card title="Danh sách dịch vụ">
                                <Form>
                                    <Row gutter={[8, 0]}>
                                        <Col>
                                            <Form.Item label="Tổng tiền">
                                                <Input disabled value={totalPrice} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                                <Table
                                    columns={serviceSubclinicalColumns}
                                    dataSource={servicePayments}
                                    pagination={false}
                                    bordered
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default ServicePayment;