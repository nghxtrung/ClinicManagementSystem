import { Button, Card, Col, Divider, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Space, Spin, Table, Tabs, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { handleApi } from "../utils/apiUtils";
import patientExaminationService from "../services/patientExaminationService";
import { CheckOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import speciallistClinicService from "../services/speciallistClinicService";
import diagnoseService from "../services/diagnoseService";
import { ConvertToOptions, GetKeyObject, handleInputData, handleInputNumber, handleInputSelect } from "../utils/dataUtils";
import patientExaminationDiagnoseService from "../services/patientExaminationDiagnoseService";
import useNotification from "../hooks/useNotification";
import medicineService from "../services/medicineService";
import prescriptionService from "../services/prescriptionService";
import prescriptionMedicineService from "../services/prescriptionMedicineService";
import serviceSubclinicalService from "../services/serviceSubclinicalService";
import serviceSubclinicDesignationService from "../services/serviceSubclinicDesignation";
import servicePaymentService from "../services/servicePaymentService";
import { EXAMINATIONSTATUS } from "../constants/optionConstant";
import reportService from "../services/reportService";

const Examination = () => {
    const [examinationNotification, examinationNotificationContext] = useNotification();
    const [loading, setLoading] = useState(false);
    const [patientExaminations, setPatientExaminations] = useState([]);
    const patientExaminationsColumns = [
        {
            title: 'Chọn',
            align: 'center',
            render: (patientExamination) => <Button icon={<CheckOutlined />} type="primary" onClick={() => loadPatientExamination(patientExamination['key'])}></Button>
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
        {
            title: 'Địa chỉ',
            dataIndex: 'address'
        },
        {
            title: 'Tên chỉ định',
            dataIndex: 'basicExaminationName'
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

    const [patient, setPatient] = useState({
        Code: null,
        Name: null,
        DateOfBirth: null,
        Sex: null,
        PhoneNumber: null,
        Address: null
    });
    const [examination, setExamination] = useState({
        Code: null,
        PatientCode: null,
        SpeciallistClinicCode: null,
        DateIn: null,
        Status: 0,
        PreliminaryDiagnosis: null,
        HeartBeat: null,
        BreathingRate: null,
        BloodPressure: null,
        Temperature: null,
        Weight: null,
        Height: null,
        Conclude: null
    });
    const [serviceSubclinic, setServiceSubclinic] = useState(null);
    const [patientExaminationDiagnose, setPatientExaminationDiagnose] = useState({
        PatientExaminationCode: null,
        Diagnoses: []
    });

    const loadPatientExamination = (code) => {
        handleApi(() => patientExaminationService.getPatientExaminationByCode(code))
            .then(data => {
                setPatient({
                    Code: data['patient']['code'],
                    Name: data['patient']['name'],
                    DateOfBirth: data['patient']['dateOfBirth'],
                    Sex: data['patient']['sex'],
                    PhoneNumber: data['patient']['phoneNumber'],
                    Address: data['patient']['address']
                });
                setExamination({
                    Code: data['code'],
                    PatientCode: data['patient']['code'],
                    SpeciallistClinicCode: data['speciallistClinicCode'],
                    DateIn: data['dateIn'],
                    Status: data['status'],
                    PreliminaryDiagnosis: data['preliminaryDiagnosis'],
                    HeartBeat: data['heartBeat'],
                    BreathingRate: data['breathingRate'],
                    BloodPressure: data['bloodPressure'],
                    Temperature: data['temperature'],
                    Weight: data['weight'],
                    Height: data['height'],
                    Conclude: data['conclude']
                });
                setServiceSubclinic(data['servicePayments'][0]['serviceSubclinical']['name']);
                setPatientExaminationDiagnose({
                    PatientExaminationCode: data['code'],
                    Diagnoses: data['patientExaminationDiagnoses'].map(item => (item['diagnoseCode']))
                });
                setPrescription({
                    ...prescription,
                    PatientExaminationCode: data['code']
                });
                setServiceSubclinicDesignation({
                    ...serviceSubclinicDesignation,
                    PatientExaminationCode: data['code']
                });
            });
        handleApi(() => medicineService.getMedicines())
            .then(data => {
                setMedicineOptions(ConvertToOptions(data, 'name', 'id'));
            });
        handleApi(() => prescriptionService.getByPatientExaminationCode(code))
            .then(data => {
                if (data !== null) {
                    setPrescription({
                        Code: data['code'],
                        PatientExaminationCode: data['patientExaminationCode'],
                        Advice: data['advice']
                    });
                    setPrescriptionMedicine({
                        ...prescriptionMedicine,
                        PrescriptionCode: data['code']
                    });
                    setPrescriptionMedicines(data['prescriptionMedicines'].map(item => ({
                        key: item['id'],
                        medicineName: item['medicine']['name'],
                        quantity: item['quantity'],
                        dosage: item['dosage'],
                        note: item['note']
                    })));
                }
            });
        handleApi(() => serviceSubclinicDesignationService.getByPatientExaminationCode(code))
            .then(data => {
                setServiceSubclinicDesignations(data.map(item => ({
                    key: item['code'],
                    serviceSubclinicId: item['serviceSubclinical']['id'],
                    serviceSubclinicName: item['serviceSubclinical']['name']
                })));
            });
        handleApi(() => serviceSubclinicalService.getServiceSubclinicalsByType(1))
            .then(data => {
                setServiceSubclinicalOptions(ConvertToOptions(data, 'name', 'id'));
            });
        setIsOpenPatientExaminationModal(true);
    }

    const changeStatusExamination = (status, message) => {
        handleApi(() => patientExaminationService.changeStatusPatientExamination(examination.Code, status))
            .then(() => {
                examinationNotification.success(message);
            }).catch(message => {
                examinationNotification.error(message);
            });
    }

    const savePatientExamination = () => {
        new Promise((resolve) => {
            handleApi(() => patientExaminationService.savePatientExamination(examination))
                .then(() => resolve())
                .catch(message => {
                    examinationNotification.error(message);
                });
        }).then(() => {
            new Promise((resolve) => {
                handleApi(() => patientExaminationDiagnoseService.savePatientExaminationDiagnose(patientExaminationDiagnose))
                    .then(() => resolve())
                    .catch(message => {
                        examinationNotification.error(message);
                    });
            });
        }).then(() => {
            changeStatusExamination(1, "Lưu thông tin thành công!");
        });
    }

    const [speciallistClinics, setSpeciallistClinics] = useState([]);
    const [diagnose, setDiagnose] = useState([]);
    useEffect(() => {
        handleApi(() => patientExaminationService.getPatientExaminationsBasicExamination(), setLoading)
            .then(data => {
                setPatientExaminations(data.map(item => ({
                    key: item['code'],
                    code: item['code'],
                    patientName: item['patient']['name'],
                    dateOfBirth: item['patient']['dateOfBirth'],
                    address: item['patient']['address'],
                    dateIn: item['dateIn'],
                    basicExaminationName: item['servicePayments'][0]['serviceSubclinical']['name'],
                    status: item['status']
                })));
            });
        handleApi(() => speciallistClinicService.getSpeciallistClinics())
            .then(data => {
                setSpeciallistClinics(data);
            });
        handleApi(() => diagnoseService.getDiagnoses())
            .then(data => {
                setDiagnose(ConvertToOptions(data, 'name', 'code'));
            });
    }, []);

    const [isOpenPatientExaminationModal, setIsOpenPatientExaminationModal] = useState(false);
    const patientExaminationTab = (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                <Card title="Thông tin tiếp nhận">
                    <Form>
                        <Row gutter={[8, 0]}>
                            <Col span={10}>
                                <Form.Item label="Mã bệnh nhân">
                                    <Input readOnly value={patient.Code} />
                                </Form.Item>
                            </Col>
                            <Col span={14}>
                                <Form.Item label="Tên Bệnh nhân" /*rules={[{ required: true }]}*/>
                                    <Input readOnly value={patient.Name} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            <Col span={5}>
                                <Form.Item label="Ngày sinh">
                                    <Input value={dayjs(patient.DateOfBirth).format("DD/MM/YYYY")} />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item label="Giới tính">
                                    <Input readOnly value={patient.Sex === true ? "Nam" : "Nữ"} />
                                </Form.Item>
                            </Col>
                            <Col span={14}>
                                <Form.Item label="Điện thoại">
                                    <Input readOnly value={patient.PhoneNumber} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            <Col span={24}>
                                <Form.Item label="Địa chỉ" className="mb-0">
                                    <Input readOnly value={patient.Address} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider />
                        <Row gutter={[8, 0]}>
                            <Col span={19}>
                                <Form.Item label="Số phiếu">
                                    <Input readOnly value={examination.Code} />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item label="Ngày lập">
                                    <Input readOnly value={dayjs(examination.DateIn).format("DD/MM/YYYY")} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            <Col span={12}>
                                <Form.Item label="Phòng khám">
                                    <Input readOnly
                                        value={examination.SpeciallistClinicCode !== null ? speciallistClinics.find(item => item['code'] === examination.SpeciallistClinicCode)['name'] : null}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Dịch vụ">
                                    <Input readOnly value={serviceSubclinic} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
            <Col span={24}>
                <Card title="Thông tin khám">
                    <Form>
                        <Row gutter={[8, 0]}>
                            <Col span={14}>
                                <Form.Item label="Chẩn đoán sơ bộ">
                                    <TextArea
                                        rows={6}
                                        name="PreliminaryDiagnosis"
                                        className="resize-none"
                                        value={examination.PreliminaryDiagnosis}
                                        onChange={e => handleInputData(e, examination, setExamination)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Row gutter={[8, 0]}>
                                    <Col span={24}>
                                        <Form.Item label="Nhịp tim">
                                            <Input
                                                suffix="nhịp/phút"
                                                name="HeartBeat"
                                                value={examination.HeartBeat}
                                                onChange={e => handleInputData(e, examination, setExamination)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 0]}>
                                    <Col span={24}>
                                        <Form.Item label="Nhiệt độ">
                                            <Input
                                                suffix="°C"
                                                name="Temperature"
                                                value={examination.Temperature}
                                                onChange={e => handleInputData(e, examination, setExamination)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 0]}>
                                    <Col span={24}>
                                        <Form.Item label="Cân nặng">
                                            <Input
                                                suffix="kg"
                                                name="Weight"
                                                value={examination.Weight}
                                                onChange={e => handleInputData(e, examination, setExamination)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={5}>
                                <Row gutter={[8, 0]}>
                                    <Col span={24}>
                                        <Form.Item label="Huyết áp">
                                            <Input
                                                suffix="mmHg"
                                                name="BloodPressure"
                                                value={examination.BloodPressure}
                                                onChange={e => handleInputData(e, examination, setExamination)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 0]}>
                                    <Col span={24}>
                                        <Form.Item label="Nhịp thở">
                                            <Input
                                                suffix="nhịp/phút"
                                                name="BreathingRate"
                                                value={examination.BreathingRate}
                                                onChange={e => handleInputData(e, examination, setExamination)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 0]}>
                                    <Col span={24}>
                                        <Form.Item label="Chiều cao">
                                            <Input
                                                suffix="cm"
                                                name="Height"
                                                value={examination.Height}
                                                onChange={e => handleInputData(e, examination, setExamination)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            <Col span={24}>
                                <Form.Item label="Chẩn đoán bệnh theo ICD">
                                    <Select
                                        mode="multiple"
                                        options={diagnose}
                                        showSearch
                                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                        value={patientExaminationDiagnose.Diagnoses}
                                        onChange={value => handleInputSelect(value, patientExaminationDiagnose, setPatientExaminationDiagnose, "Diagnoses")}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Kết luận & hướng điều trị">
                                    <TextArea
                                        rows={6}
                                        className="resize-none"
                                        name="Conclude"
                                        value={examination.Conclude}
                                        onChange={e => handleInputData(e, examination, setExamination)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
            <Col span={24}>
                <Space className="float-right">
                    <Popconfirm
                        title="Kết thúc khám"
                        description="Bạn có chắn chắn muốn kết thúc khám cho bệnh nhân này?"
                        onConfirm={() => changeStatusExamination(2, "Kết thúc khám thành công!")}
                    >
                        <Button icon={<CheckOutlined />}>Kết thúc khám</Button>
                    </Popconfirm>
                    <Popconfirm
                        title="Lưu thông tin khám"
                        description="Bạn có chắn muốn lưu thông tin khám cho bệnh nhân này?"
                        onConfirm={savePatientExamination}
                    >
                        <Button type="primary" icon={<SaveOutlined />}>Lưu</Button>
                    </Popconfirm>
                </Space>
            </Col>
        </Row>
    );

    const emptyPrescription = {
        Code: null,
        PatientExaminationCode: null,
        Advice: null
    }
    const [prescription, setPrescription] = useState(emptyPrescription);
    const emptyPrescriptionMedicine = {
        Id: null,
        PrescriptionCode: null,
        MedicineId: null,
        Quantity: null,
        Dosage: null,
        Note: null
    }
    const [prescriptionMedicine, setPrescriptionMedicine] = useState(emptyPrescriptionMedicine);
    const [medicineOptions, setMedicineOptions] = useState([]);
    const [maxQuantityMedicine, setMaxQuantityMedicine] = useState(null);
    const [prescriptionMedicines, setPrescriptionMedicines] = useState([]);
    const loadMedicine = (id) => {
        if (id !== null && id !== undefined) {
            handleApi(() => medicineService.getMedicineById(id))
                .then(data => {
                    setMaxQuantityMedicine(data['quantity']);
                });
        } else {
            setMaxQuantityMedicine(null);
        }
        setPrescriptionMedicine({
            ...prescriptionMedicine,
            Quantity: null
        });
    }
    const savePrescription = () => {
        handleApi(() => prescriptionService.savePrescription(prescription))
            .then(data => {
                setPrescription({
                    Code: data['code'],
                    PatientExaminationCode: data['patientExaminationCode'],
                    Advice: data['advice']
                });
                setPrescriptionMedicine({
                    ...prescriptionMedicine,
                    PrescriptionCode: data['code']
                });
                examinationNotification.success("Lưu thông tin đơn thuốc thành công");
            }).catch(message => {
                examinationNotification.error(message);
            });
    }
    const savePrescriptionMedicine = () => {
        new Promise((resolve) => {
            handleApi(() => prescriptionMedicineService.savePrescriptionMedicine(prescriptionMedicine))
                .then(data => resolve(data['prescriptionCode']))
                .catch(message => {
                    examinationNotification.error(message);
                });
        }).then(prescriptionCode => {
            handleApi(() => prescriptionMedicineService.getByPrescriptionCode(prescriptionCode))
                .then(data => {
                    setPrescriptionMedicines(data.map(item => ({
                        key: item['id'],
                        medicineName: item['medicine']['name'],
                        quantity: item['quantity'],
                        dosage: item['dosage'],
                        note: item['note']
                    })));
                    examinationNotification.success("Thêm thuốc thành công!");
                }).catch(message => {
                    examinationNotification.error(message);
                });
        });
    }
    const deletePrescriptionMedicine = (id) => {
        new Promise((resolve) => {
            handleApi(() => prescriptionMedicineService.deletePrescriptionMedicineById(id))
                .then(() => resolve())
                .catch(message => {
                    examinationNotification.error(message);
                });
        }).then(() => {
            handleApi(() => prescriptionMedicineService.getByPrescriptionCode(prescription.Code))
                .then(data => {
                    setPrescriptionMedicines(data.map(item => ({
                        key: item['id'],
                        medicineName: item['medicine']['name'],
                        quantity: item['quantity'],
                        dosage: item['dosage'],
                        note: item['note']
                    })));
                    examinationNotification.success("Xoá thuốc thành công!");
                }).catch(message => {
                    examinationNotification.error(message);
                });
        })
    }

    const deletePrescription = (code) => {
        handleApi(() => prescriptionService.deletePrescriptionByCode(code))
            .then(() => {
                examinationNotification.success("Xoá đơn thuốc thành công");
                setPrescription(emptyPrescription);
                setPrescriptionMedicines([]);
            }).catch(message => {
                examinationNotification.error(message);
            });
    }

    const [isOpenPrint, setIsOpenPrint] = useState(false);
    const [printData, setPrintData] = useState("");
    const [loadingPrint, setLoadingPrint] = useState(false);
    const print = () => {
        handleApi(() => reportService.getPrescriptionReport(prescription.PatientExaminationCode), setLoadingPrint)
            .then(data => {
                setPrintData(data);
                setIsOpenPrint(true);
            });
    }

    const prescriptionMedicineColumns = [
        {
            title: 'Hành động',
            align: 'center',
            render: (prescriptionMedicine) => <Button icon={<DeleteOutlined />} type="primary" danger onClick={() => deletePrescriptionMedicine(prescriptionMedicine['key'])}></Button>
        },
        {
            title: 'Tên thuốc',
            dataIndex: 'medicineName'
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity'
        },
        {
            title: 'Liều dùng',
            dataIndex: 'dosage'
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note'
        }
    ];

    const prescriptionTab = (
        <>
            <Row>
                <Col span={24}>
                    <Card title="Thông tin đơn thuốc" extra={
                        <Space>
                            <Button disabled={prescription.Code !== null} onClick={savePrescription}>Nhập mới</Button>
                            <Button onClick={savePrescription}>Lưu</Button>
                            <Button disabled={prescription.Code === null} onClick={() => deletePrescription(prescription.Code)}>Xoá</Button>
                            <Button loading={loadingPrint} onClick={print}>In</Button>
                        </Space>
                    }>
                        <Form>
                            <Row gutter={[8, 0]}>
                                <Col span={12}>
                                    <Form.Item label="Số phiếu khám" className="mb-0">
                                        <Input disabled value={prescription.PatientExaminationCode} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Số đơn thuốc" className="mb-0">
                                        <Input disabled value={prescription.Code} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={[8, 0]}>
                                <Col span={20}>
                                    <Form.Item label="Thuốc">
                                        <Select
                                            options={medicineOptions}
                                            showSearch
                                            allowClear
                                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                            onChange={value => { loadMedicine(value); handleInputSelect(value, prescriptionMedicine, setPrescriptionMedicine, "MedicineId"); }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item>
                                        <InputNumber
                                            placeholder={maxQuantityMedicine > 0 ? maxQuantityMedicine : ""}
                                            disabled={maxQuantityMedicine <= 0}
                                            min={1}
                                            max={maxQuantityMedicine}
                                            value={prescriptionMedicine.Quantity}
                                            onChange={value => handleInputNumber(value, prescriptionMedicine, setPrescriptionMedicine, "Quantity")}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 0]}>
                                <Col span={12}>
                                    <Form.Item label="Liều dùng">
                                        <Input
                                            name="Dosage"
                                            value={prescriptionMedicine.Dosage}
                                            onChange={e => handleInputData(e, prescriptionMedicine, setPrescriptionMedicine)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Ghi chú">
                                        <Input
                                            name="Note"
                                            value={prescriptionMedicine.Note}
                                            onChange={e => handleInputData(e, prescriptionMedicine, setPrescriptionMedicine)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item>
                                        <Button onClick={savePrescriptionMedicine}>Thêm thuốc</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            columns={prescriptionMedicineColumns}
                            dataSource={prescriptionMedicines}
                            pagination={false}
                            scroll={{ y: 250 }}
                        />
                        <Form className="mt-6">
                            <Form.Item label="Lời dặn" className="mb-0">
                                <TextArea
                                    rows={4}
                                    className="resize-none"
                                    value={prescription.Advice}
                                    name="Advice"
                                    onChange={e => handleInputData(e, prescription, setPrescription)}
                                />
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Đơn thuốc"
                open={isOpenPrint}
                onCancel={() => setIsOpenPrint(false)}
                footer={null}
                className="w-9/12"
            >
                <embed src={`data:application/pdf;base64,${printData}`} width={'100%'} height={700} />
            </Modal>
        </>
    );

    const serviceSubclinicalColumns = [
        {
            title: 'Hành động',
            align: 'center',
            render: (serviceSubclinic) => <Button icon={<DeleteOutlined />} type="primary" danger
                onClick={() => deleteServiceSubclinicDesignationById(serviceSubclinic['serviceSubclinicId'])}></Button>
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'serviceSubclinicName'
        }
    ]
    const [serviceSubclinicalOptions, setServiceSubclinicalOptions] = useState([]);
    const [serviceSubclinicDesignation, setServiceSubclinicDesignation] = useState({
        PatientExaminationCode: null,
        ServiceSubclinicalId: null,
    });
    const [serviceSubclinicDesignations, setServiceSubclinicDesignations] = useState([]);
    const saveServiceSubclinicDesignation = () => {
        new Promise((resolve) => {
            handleApi(() => serviceSubclinicDesignationService.saveServiceSubclinicDesignation(serviceSubclinicDesignation))
                .then(data => resolve(data['code']))
                .catch(message => {
                    examinationNotification.error(message);
                });
        }).then(code => {
            new Promise((resolve) => {
                handleApi(() => serviceSubclinicDesignationService.changeStatusServiceSubclinicDesignation(code, 0))
                    .then(() => resolve())
                    .catch(message => {
                        examinationNotification.error(message);
                    });
            });
        }).then(() => {
            new Promise((resolve) => {
                handleApi(() => servicePaymentService.saveServicePayment(serviceSubclinicDesignation))
                    .then(() => resolve())
                    .catch(message => {
                        examinationNotification.error(message);
                    });
            });
        }).then(() => {
            handleApi(() => serviceSubclinicDesignationService.getByPatientExaminationCode(serviceSubclinicDesignation.PatientExaminationCode))
                .then(data => {
                    setServiceSubclinicDesignations(data.map(item => ({
                        key: item['code'],
                        serviceSubclinicId: item['serviceSubclinical']['id'],
                        serviceSubclinicName: item['serviceSubclinical']['name']
                    })));
                    examinationNotification.success("Lưu thông tin chỉ định thành công!");
                });
        });
    }
    const deleteServiceSubclinicDesignationById = (id) => {
        new Promise((resolve) => {
            handleApi(() => serviceSubclinicDesignationService.deleteServiceSubclinicDesignationById(id))
                .then(() => resolve())
                .catch(message => {
                    examinationNotification.error(message);
                })
        }).then(() => {
            handleApi(() => serviceSubclinicDesignationService.getByPatientExaminationCode(serviceSubclinicDesignation.PatientExaminationCode))
                .then(data => {
                    setServiceSubclinicDesignations(data.map(item => ({
                        key: item['id'],
                        serviceSubclinicId: item['serviceSubclinical']['id'],
                        serviceSubclinicName: item['serviceSubclinical']['name']
                    })));
                    examinationNotification.success("Xoá chỉ định thành công!");
                });
        })
    }

    const subclinicalTab = (
        <Row>
            <Col span={24}>
                <Card title="Thông tin chỉ định dịch vụ">
                    <Form>
                        <Row gutter={[8, 0]}>
                            <Col span={20}>
                                <Form.Item label="Dịch vụ">
                                    <Select
                                        options={serviceSubclinicalOptions}
                                        showSearch
                                        allowClear
                                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                        onChange={value => handleInputSelect(value, serviceSubclinicDesignation, setServiceSubclinicDesignation, "ServiceSubclinicalId")}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item>
                                    <Button onClick={saveServiceSubclinicDesignation}>Thêm dịch vụ</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        columns={serviceSubclinicalColumns}
                        dataSource={serviceSubclinicDesignations}
                        pagination={false}
                        scroll={{ y: 250 }}
                    />
                </Card>
            </Col>
        </Row>
    );

    const tabItems = [
        {
            key: 1,
            label: 'Thông tin phiếu khám',
            children: patientExaminationTab
        },
        {
            key: 2,
            label: 'Đơn thuốc',
            children: prescriptionTab
        },
        {
            key: 3,
            label: 'Chỉ định dịch vụ',
            children: subclinicalTab
        }
    ]

    return (
        <Spin spinning={loading}>
            {examinationNotificationContext}
            <Row>
                <Col span={24}>
                    <Card title="Danh sách khám bệnh">
                        <Table columns={patientExaminationsColumns} dataSource={patientExaminations} />
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Thông tin khám bệnh"
                open={isOpenPatientExaminationModal}
                onCancel={() => setIsOpenPatientExaminationModal(false)}
                maskClosable={false}
                footer={null}
                keyboard={false}
                centered
                className="w-3/5"
            >
                <Tabs defaultActiveKey={1} items={tabItems} />
            </Modal>
        </Spin>
    );
}

export default Examination;