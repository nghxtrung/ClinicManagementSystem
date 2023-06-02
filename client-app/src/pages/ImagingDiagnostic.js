import { Button, Card, Col, Divider, Form, Image, Input, Modal, Row, Space, Spin, Table, Tag, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import { handleApi } from "../utils/apiUtils";
import serviceSubclinicDesignationService from "../services/serviceSubclinicDesignation";
import { EXAMINATIONSTATUS } from "../constants/optionConstant";
import { GetKeyObject, handleInputData } from "../utils/dataUtils";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import useNotification from "../hooks/useNotification";
import reportService from "../services/reportService";

const ImagingDiagnostic = () => {
    const [notification, notificationContext] = useNotification();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadIndex, setLoadIndex] = useState(0);
    const [serviceSubClinicDesignation, setServiceSubClinicDesignation] = useState({
        Code: null,
        Name: null,
        Result: null,
        Conclude: null,
    });
    const [imageResult, setImageResult] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const loadServiceSubclinicDesignation = (code) => {
        setFileList([]);
        handleApi(() => serviceSubclinicDesignationService.getServiceSubclinicDesignationByCode(code))
            .then(data => {
                setServiceSubClinicDesignation({
                    Code: data['code'],
                    Name: data['serviceSubclinical']['name'],
                    Result: data['result'],
                    Conclude: data['conclude']
                });
                setImageResult(`data:image/png;base64,${data['imageResult']}`);
                setIsOpenModal(true);
            });
    }
    const updateServiceSubclinicDesignation = () => {
        const formData = new FormData();
        formData.append("Code", serviceSubClinicDesignation.Code);
        formData.append("Name", serviceSubClinicDesignation.Name);
        formData.append("Result", serviceSubClinicDesignation.Result);
        formData.append("Conclude", serviceSubClinicDesignation.Conclude);
        formData.append("imageFile", fileList.length > 0 ? fileList[0] : null);
        new Promise((resolve) => {
            handleApi(() => serviceSubclinicDesignationService.updateServiceSubclinicDesignation(formData))
                .then(() => resolve())
                .catch(message => notification.error(message));
        }).then(() => {
            handleApi(() => serviceSubclinicDesignationService.changeStatusServiceSubclinicDesignation(serviceSubClinicDesignation.Code, 1))
                .then(() => {
                    setLoadIndex(loadIndex + 1);
                    notification.success("Lưu thông tin thành công!");
                }).catch(message => notification.error(message));
        });
    }
    const [isOpenPrint, setIsOpenPrint] = useState(false);
    const [printData, setPrintData] = useState(null);
    const [loadingPrint, setLoadingPrint] = useState(false);
    const print = () => {
        handleApi(() => reportService.getPatientServiceSubclinicalResultReport(serviceSubClinicDesignation.Code), setLoadingPrint)
            .then(data => {
                setPrintData(data);
                setIsOpenPrint(true);
            });
    }
    const serviceSubclinicDesignationColumns = [
        {
            title: 'Chọn',
            align: 'center',
            render: (serviceSubclinicDesignation) => <Button icon={<CheckOutlined />} type="primary" onClick={() => loadServiceSubclinicDesignation(serviceSubclinicDesignation['key'])}></Button>
        },
        {
            title: 'Ngày',
            dataIndex: 'dateCreate',
            render: (_, { dateCreate }) => dayjs(dateCreate).format("DD/MM/YYYY")
        },
        {
            title: 'Mã chỉ định',
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
        {
            title: 'Địa chỉ',
            dataIndex: 'address'
        },
        {
            title: 'Tên chỉ định',
            dataIndex: 'serviceSubclinicalName'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (_, { status }) => {
                const statusName = GetKeyObject(EXAMINATIONSTATUS, status);
                switch (status) {
                    case EXAMINATIONSTATUS['Chưa khám']:
                        return <Tag color="error">{statusName}</Tag>
                    case EXAMINATIONSTATUS['Chờ kết quả']:
                        return <Tag color="warning">{statusName}</Tag>
                    case EXAMINATIONSTATUS['Đã khám']:
                        return <Tag color="success">{statusName}</Tag>
                    default:
                        return <></>
                }
            },
            filters: [
                {
                    text: 'Chưa khám',
                    value: 0,
                },
                {
                    text: 'Chờ kết quả',
                    value: 1,
                },
                {
                    text: 'Đã khám',
                    value: 2,
                },
            ],
            onFilter: (value, record) => record['status'] === value
        }
    ];
    const [serviceSubclinicDesignations, setServiceSubclinicDesignations] = useState([]);
    useEffect(() => {
        handleApi(() => serviceSubclinicDesignationService.getServiceSubclinicDesignations(), setLoading)
            .then(data => {
                setServiceSubclinicDesignations(data.map(item => ({
                    key: item['code'],
                    dateCreate: item['dateCreate'],
                    code: item['code'],
                    patientName: item['patientExamination']['patient']['name'],
                    dateOfBirth: item['patientExamination']['patient']['dateOfBirth'],
                    address: item['patientExamination']['patient']['address'],
                    serviceSubclinicalName: item['serviceSubclinical']['name'],
                    status: item['status']
                })));
            });
    }, [loadIndex]);
    return (
        <Spin spinning={loading}>
            {notificationContext}
            <Row>
                <Col span={24}>
                    <Card title="Danh sách chỉ định">
                        <Table
                            columns={serviceSubclinicDesignationColumns}
                            dataSource={serviceSubclinicDesignations}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Thông tin chỉ định"
                open={isOpenModal}
                onCancel={() => setIsOpenModal(false)}
                maskClosable={false}
                footer={(
                    <Space>
                        <Button loading={loadingPrint} onClick={print}>In</Button>
                        <Button onClick={updateServiceSubclinicDesignation}>Lưu</Button>
                    </Space>
                )}
                keyboard={false}
                centered
                className="w-3/5"
            >
                <Divider />
                <Form>
                    <Row gutter={[8, 0]}>
                        <Col span={12}>
                            <Form.Item label="Mã chỉ định">
                                <Input readOnly value={serviceSubClinicDesignation.Code} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Tên chỉ định">
                                <Input readOnly value={serviceSubClinicDesignation.Name} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Hình ảnh">
                                <Upload fileList={fileList} beforeUpload={file => {
                                    setFileList([...fileList, file]);
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onload = () => setImageResult(reader.result);
                                    return false;
                                }} onRemove={file => {
                                    setFileList([]);
                                }} maxCount={1}>
                                    <Button icon={<UploadOutlined />} className="mb-2">Chọn ảnh</Button>
                                </Upload>
                                <Image height={100} src={imageResult} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Kết quả">
                                <TextArea
                                    rows={20}
                                    className="resize-none"
                                    name="Result"
                                    value={serviceSubClinicDesignation.Result}
                                    onChange={e => handleInputData(e, serviceSubClinicDesignation, setServiceSubClinicDesignation)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Kết luận">
                                <TextArea
                                    rows={2}
                                    className="resize-none"
                                    name="Conclude"
                                    value={serviceSubClinicDesignation.Conclude}
                                    onChange={e => handleInputData(e, serviceSubClinicDesignation, setServiceSubClinicDesignation)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal
                title="Phiếu kết quả"
                open={isOpenPrint}
                onCancel={() => setIsOpenPrint(false)}
                footer={null}
                className="w-9/12"
            >
                <embed src={`data:application/pdf;base64,${printData}`} width={'100%'} height={700} />
            </Modal>
        </Spin>
    );
}

export default ImagingDiagnostic;