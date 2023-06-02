import React, { useEffect, useState } from "react";
import { Button, Card, Col, DatePicker, Form, Input, Modal, Popconfirm, Radio, Row, Select, Space, Spin, Table, Tag } from "antd";
import { CheckOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import speciallistClinicService from "../services/speciallistClinicService";
import { handleApi } from "../utils/apiUtils";
import { ConvertToOptions, GetKeyObject, handleInputData, handleInputDate, handleInputSelect } from "../utils/dataUtils";
import patientService from "../services/patientService";
import { EXAMINATIONSTATUS, SEX } from "../constants/optionConstant";
import useNotification from "../hooks/useNotification";
import dayjs from "dayjs";
import patientExaminationService from "../services/patientExaminationService";
import serviceSubclinicalService from "../services/serviceSubclinicalService";
import servicePaymentService from "../services/servicePaymentService";
import statisticService from "../services/statisticService";

const PatientReception = () => {
    const [patientReceptionNotification, patientReceptionNotificationContext] = useNotification();
    const [speciallistClinicOptions, setSpeciallistClinicOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveIndex, setSaveIndex] = useState(0);

    //#region Thông tin bệnh nhân
    const emptyPatient = {
        Code: null,
        Name: null,
        DateOfBirth: null,
        Sex: null,
        PhoneNumber: null,
        Address: null
    }
    const [patient, setPatient] = useState(emptyPatient);
    //#endregion 

    //#region Thông tin khám
    const emptyExaminaton = {
        Code: null,
        PatientCode: null,
        SpeciallistClinicCode: null,
        DateIn: null,
        Status: 0
    }
    const [examination, setExamination] = useState(emptyExaminaton);
    //#endregion

    //#region Thông tin thanh toán
    const emptyServicePayment = {
        Id: null,
        PatientExaminationCode: null,
        ServiceSubclinicalId: null,
        Price: null,
        Status: 0
    }
    const [servicePayment, setServicePayment] = useState(emptyServicePayment);
    //#endregion

    //#region Các chức năng chính
    //Nhập mới
    const newInput = () => {
        setPatient(emptyPatient);
        setExamination(emptyExaminaton);
        setServicePayment(emptyServicePayment);
        patientReceptionNotification.info("Đã vào chế độ nhập mới");
    }
    //Lưu
    const save = () => {
        new Promise((resolve) => {
            handleApi(() => patientService.savePatient(patient))
                .then(data => {
                    setPatient({
                        ...patient,
                        Code: data['code']
                    });
                    resolve(data['code']);
                }).catch(message => {
                    patientReceptionNotification.error(message);
                });
        }).then(patientCode => {
            return new Promise((resolve) => {
                let examinationDTO = examination;
                examination.PatientCode = patientCode;
                handleApi(() => patientExaminationService.savePatientExamination(examinationDTO))
                    .then(data => {
                        setExamination({
                            ...examination,
                            Code: data['code'],
                            PatientCode: data['patientCode']
                        });
                        resolve(data['code']);
                    }).catch(message => {
                        patientReceptionNotification.error(message);
                    });
            });
        }).then(patientExaminationCode => {
            let servicePaymentDTO = servicePayment;
            servicePaymentDTO.PatientExaminationCode = patientExaminationCode;
            handleApi(() => servicePaymentService.saveServicePayment(servicePaymentDTO))
                .then(data => {
                    setServicePayment({
                        ...servicePayment,
                        Id: data['id'],
                        PatientExaminationCode: data['PatientExaminationCode'],
                        Price: data['price'],
                        Status: data['status']
                    });
                    patientReceptionNotification.success("Lưu thông tin khám bệnh nhân thành công");
                    setSaveIndex(saveIndex + 1);
                }).catch(message => {
                    patientReceptionNotification.error(message);
                });
        });
    }
    //#endregion

    //#region Danh sách bệnh nhân
    const [isPatientListModalOpen, setIsPatientListModalOpen] = useState(false);
    const [loadingPatientList, setLoadingPatientList] = useState(false);
    const patientColumns = [
        {
            title: 'Chọn',
            align: 'center',
            render: (patient) => {
                return (
                    <Button icon={<CheckOutlined />} type="primary" onClick={() => selectPatient(patient)}></Button>
                );
            }
        },
        {
            title: 'Mã bệnh nhân',
            dataIndex: 'code'
        },
        {
            title: 'Tên bệnh nhân',
            dataIndex: 'name'
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            render: (_, { dateOfBirth }) => dayjs(dateOfBirth).format("DD/MM/YYYY")
        },
        {
            title: 'Giới tính',
            dataIndex: 'sex',
            render: (_, { sex }) => sex === true ? "Nam" : "Nữ"
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber'
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address'
        }
    ]
    const [patients, setPatients] = useState([]);
    const openPatientList = () => {
        setIsPatientListModalOpen(true);
        handleApi(() => patientService.getPatients(), setLoadingPatientList)
            .then(data => {
                setPatients(data.map(item => ({
                    key: item['code'],
                    code: item['code'],
                    name: item['name'],
                    dateOfBirth: item['dateOfBirth'],
                    sex: item['sex'],
                    phoneNumber: item['phoneNumber'],
                    address: item['address']
                })));
            });
    }
    const searchPatient = (event) => {
        if (event.keyCode === 13) {
            handleApi(() => patientService.getPatientsByFilter(event.target.value), setLoadingPatientList)
                .then(data => {
                    setPatients(data.map(item => ({
                        key: item['code'],
                        code: item['code'],
                        name: item['name'],
                        dateOfBirth: item['dateOfBirth'],
                        sex: item['sex'],
                        phoneNumber: item['phoneNumber'],
                        address: item['address']
                    })));
                });
        }
    }
    const selectPatient = (patient) => {
        setPatient({
            Code: patient['code'],
            Name: patient['name'],
            DateOfBirth: patient['dateOfBirth'],
            Sex: patient['sex'],
            PhoneNumber: patient['phoneNumber'],
            Address: patient['address']
        });
        setIsPatientListModalOpen(false);
    }
    //#endregion

    //#region Danh sách phiếu khám
    const [patientExaminations, setPatientExaminations] = useState([]);
    const patientExaminationColumns = [
        {
            title: 'Hành động',
            align: 'center',
            render: (patientExamination) => {
                return (
                    <Space>
                        <Button icon={<CheckOutlined />} type="primary" onClick={() => selectPatientExamination(patientExamination)}></Button>
                        <Popconfirm
                            title="Xoá phiếu khám"
                            description="Bạn có chắn muốn xoá thông tin phiếu khám này?"
                            onConfirm={() => deletePatientExamination(patientExamination['key'])}
                        >
                            <Button icon={<DeleteOutlined />} type="primary" danger></Button>
                        </Popconfirm>
                    </Space>
                );
            }
        },
        {
            title: 'Ngày lập',
            dataIndex: 'dateIn',
            render: (_, { dateIn }) => dayjs(dateIn).format("DD/MM/YYYY")
        },
        {
            title: 'Mã phiếu khám',
            dataIndex: 'code',
        },
        {
            title: 'Bệnh nhân',
            dataIndex: 'patientName',
        },
        {
            title: 'Phòng khám',
            dataIndex: 'speciallistClinicName'
        },
        {
            title: 'Trạng thái',
            align: 'center',
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
            }
        }
    ];
    const selectPatientExamination = (patientExamination) => {
        setPatient({
            Code: patientExamination['patient']['code'],
            Name: patientExamination['patient']['name'],
            DateOfBirth: patientExamination['patient']['dateOfBirth'],
            Sex: patientExamination['patient']['sex'],
            PhoneNumber: patientExamination['patient']['phoneNumber'],
            Address: patientExamination['patient']['address']
        });
        setExamination({
            Code: patientExamination['code'],
            PatientCode: patientExamination['patient']['code'],
            SpeciallistClinicCode: patientExamination['speciallistClinic']['code'],
            DateIn: patientExamination['dateIn'],
            Status: patientExamination['status']
        });
        handleApi(() => serviceSubclinicalService.getsBySpeciallistClinicCode(patientExamination['speciallistClinic']['code']))
            .then(data => {
                setServiceSubclinicalOptions(ConvertToOptions(data, 'name', 'id'));
            }).then(() => {
                handleApi(() => servicePaymentService.getBasicExaminationByPatientExaminationCode(patientExamination['code']))
                    .then(data => {
                        setServicePayment({
                            Id: data['id'],
                            PatientExaminationCode: data['patientExaminationCode'],
                            ServiceSubclinicalId: data['serviceSubclinicalId'],
                            Price: data['price'],
                            Status: data['status']
                        });
                    });
            });
    }
    const specialistClinicStatusColumns = [
        {
            title: 'Phòng khám',
            dataIndex: 'name'
        },
        {
            title: 'Trạng thái',
            render: (_, { totalReceived, totalCompleted }) => (
                <Space>
                    <Tag color="red">{`Tiếp đón: ${totalReceived}`}</Tag>
                    <Tag color="green">{`Đã khám: ${totalCompleted}`}</Tag>
                </Space>
            )
        }
    ];
    const [specialistClinicStatusData, setSpeciallistClinicStatusData] = useState([]);
    useEffect(() => {
        //Load danh sách phiếu khám
        handleApi(() => patientExaminationService.getPatientExaminations(), setLoading)
            .then(data => {
                setPatientExaminations(data.map(item => ({
                    key: item['code'],
                    code: item['code'],
                    patient: item['patient'],
                    patientName: item['patient']['name'],
                    speciallistClinic: item['speciallistClinic'],
                    speciallistClinicName: item['speciallistClinic']['name'],
                    dateIn: item['dateIn'],
                    status: item['status'],
                })));
            });
        handleApi(() => statisticService.getSpeciallistClinicStatusStatistics(), setLoading)
            .then(data => {
                setSpeciallistClinicStatusData(data.map(item => ({
                    key: item['code'],
                    name: item['name'],
                    totalReceived: item['totalReceived'],
                    totalCompleted: item['totalCompleted']
                })));
            })
    }, [saveIndex]);
    const deletePatientExamination = (code) => {
        handleApi(() => patientExaminationService.deletePatientExaminationByCode(code))
            .then(() => {
                setSaveIndex(saveIndex + 1);
                patientReceptionNotification.success("Xoá thông phiếu khám thành công!");
            }).catch(message => {
                patientReceptionNotification.error(message);
            });
    }
    //#endregion

    const buttons = (
        <Space>
            <Button icon={<FontAwesomeIcon icon="fa-solid fa-hospital-user" className="mr-2" />} onClick={openPatientList}>Danh sách BN</Button>
            <Button icon={<PlusOutlined />} onClick={newInput}>Nhập mới</Button>
            <Popconfirm
                title="Lưu thông tin"
                description="Bạn có chắn chắn muốn lưu thông tin?"
                onConfirm={save}
            >
                <Button icon={<SaveOutlined />}>Lưu</Button>
            </Popconfirm>
            {/* <Button icon={<ReloadOutlined />}>Làm mới</Button> */}
        </Space>
    );

    const [serviceSubclinicalOptions, setServiceSubclinicalOptions] = useState([]);
    const loadServiceSubclinic = (code) => {
        setServicePayment({
            ...servicePayment,
            ServiceSubclinicalId: null
        });
        handleApi(() => serviceSubclinicalService.getsBySpeciallistClinicCode(code))
            .then(data => {
                setServiceSubclinicalOptions(ConvertToOptions(data, 'name', 'id'));
            });
    }

    useEffect(() => {
        //Load select danh sách phòng khám
        handleApi(() => speciallistClinicService.getSpeciallistClinics())
            .then(data => {
                setSpeciallistClinicOptions(ConvertToOptions(data, 'name', 'code'));
            });
    }, []);

    return (
        <Spin spinning={loading}>
            {patientReceptionNotificationContext}
            <Row gutter={[8, 0]}>
                <Col span={16}>
                    <Row gutter={[0, 8]}>
                        <Col span={24}>
                            <Card title="Thông tin bệnh nhân" bordered={false} extra={buttons}>
                                <Form>
                                    <Row gutter={[8, 0]}>
                                        <Col span={10}>
                                            <Form.Item label="Mã bệnh nhân">
                                                <Input disabled name="Code" value={patient.Code} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <Form.Item label="Tên Bệnh nhân" /*rules={[{ required: true }]}*/>
                                                <Input
                                                    name="Name"
                                                    value={patient.Name}
                                                    onChange={e => handleInputData(e, patient, setPatient)} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[8, 0]}>
                                        <Col span={5}>
                                            <Form.Item label="Ngày sinh">
                                                <DatePicker
                                                    value={patient.DateOfBirth !== null ? dayjs(patient.DateOfBirth).add(-1, 'day') : null}
                                                    placeholder=""
                                                    format={"DD/MM/YYYY"}
                                                    onChange={date => handleInputDate(date, patient, setPatient, "DateOfBirth")} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
                                            <Form.Item label="Giới tính">
                                                <Radio.Group
                                                    value={patient.Sex}
                                                    name="Sex"
                                                    optionType="button"
                                                    options={SEX}
                                                    buttonStyle="solid"
                                                    onChange={e => handleInputData(e, patient, setPatient)} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <Form.Item label="Điện thoại">
                                                <Input
                                                    value={patient.PhoneNumber}
                                                    name="PhoneNumber"
                                                    onChange={e => handleInputData(e, patient, setPatient)} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item label="Địa chỉ">
                                                <Input
                                                    value={patient.Address}
                                                    name="Address"
                                                    onChange={e => handleInputData(e, patient, setPatient)} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card title="Thông tin khám" bordered={false}>
                                <Form>
                                    <Row gutter={[8, 0]}>
                                        <Col span={19}>
                                            <Form.Item label="Số phiếu">
                                                <Input disabled value={examination.Code} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
                                            <Form.Item label="Ngày lập">
                                                <DatePicker
                                                    value={examination.DateIn !== null ? dayjs(examination.DateIn).add(-1, 'day') : null}
                                                    placeholder=""
                                                    format={"DD/MM/YYYY"}
                                                    onChange={date => handleInputDate(date, examination, setExamination, "DateIn")} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[8, 0]}>
                                        <Col span={12}>
                                            <Form.Item label="Phòng khám">
                                                <Select
                                                    disabled={servicePayment.Price !== null}
                                                    value={examination.SpeciallistClinicCode}
                                                    showSearch
                                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                                    options={speciallistClinicOptions}
                                                    onChange={value => { handleInputSelect(value, examination, setExamination, "SpeciallistClinicCode"); loadServiceSubclinic(value) }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Dịch vụ">
                                                <Select
                                                    disabled={servicePayment.Price !== null}
                                                    value={servicePayment.ServiceSubclinicalId}
                                                    showSearch
                                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                                    options={serviceSubclinicalOptions}
                                                    onChange={value => handleInputSelect(value, servicePayment, setServicePayment, "ServiceSubclinicalId")}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card title={`Danh sách phiếu khám ${patientExaminations.length > 0 ? `(${patientExaminations.length})` : ""}`}>
                                <Table
                                    columns={patientExaminationColumns}
                                    dataSource={patientExaminations}
                                    // pagination={JSON.parse(patientExaminationPagination)}
                                    // onChange={handleTableChange}
                                    pagination={false}
                                    scroll={{ y: 200 }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col span={8}>
                    <Card
                        title="Thông tin các phòng khám"
                    // extra={<Button icon={<ReloadOutlined />}>Làm mới</Button>}
                    >
                        <Table
                            columns={specialistClinicStatusColumns}
                            dataSource={specialistClinicStatusData}
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                title={`Danh sách bệnh nhân ${patients.length > 0 ? `(${patients.length})` : ""}`}
                open={isPatientListModalOpen}
                onCancel={() => setIsPatientListModalOpen(false)}
                footer={null}
                className="w-fit"
            >
                <Form>
                    <Form.Item label="Tìm kiếm">
                        <Input placeholder="Mã bệnh nhân, tên bệnh nhân, số điện thoại" onKeyDown={searchPatient} />
                    </Form.Item>
                </Form>
                <Table
                    columns={patientColumns}
                    dataSource={patients}
                    pagination={false}
                    scroll={{ y: 500 }}
                    bordered
                    loading={loadingPatientList}
                />
            </Modal>
        </Spin>
    );
}

export default PatientReception;