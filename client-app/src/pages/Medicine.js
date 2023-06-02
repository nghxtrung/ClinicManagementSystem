import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, InputNumber, Row, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { handleApi } from "../utils/apiUtils";
import useNotification from "../hooks/useNotification";
import { handleInputData, handleInputNumber } from "../utils/dataUtils";
import medicineService from "../services/medicineService";

const Medicine = () => {
    const [notification, notificationContext] = useNotification();
    const [loading, setLoading] = useState(false);
    const emptyMedicine = {
        Id: null,
        Name: null,
        Unit: null,
        Quantity: null
    }
    const [medicine, setMedicine] = useState(emptyMedicine);
    const [medicines, setMedicines] = useState([]);
    const [loadIndex, setLoadIndex] = useState(0);
    const [medicineKeySelected, setMedicineKeySelected] = useState(null);
    const userColumns = [
        {
            title: 'Hành động',
            render: (medicine) => (
                <Space>
                    <Button icon={<CheckOutlined />} type="primary" onClick={() => edit(medicine)}></Button>
                    <Button icon={<DeleteOutlined />} type="primary" danger onClick={() => remove(medicine['key'])}></Button>
                </Space>
            )
        },
        {
            title: 'Tên thuốc',
            dataIndex: 'Name'
        },
        {
            title: 'Đơn vị',
            dataIndex: 'Unit'
        },
        {
            title: 'Số lượng',
            dataIndex: 'Quantity'
        }
    ];

    const edit = (medicine) => {
        setMedicineKeySelected(medicine['key']);
        setMedicine({
            Id: medicine['key'],
            Name: medicine['Name'],
            Unit: medicine['Unit'],
            Quantity: medicine['Quantity'],
        });
    }

    const save = () => {
        handleApi(() => medicineService.saveMedicine(medicine), setLoading)
            .then(() => {
                setLoadIndex(loadIndex + 1);
                notification.success("Lưu thông tin thuốc thành công!");
            })
            .catch(message => {
                notification.error(message);
            });
    }

    const remove = (id) => {
        handleApi(() => medicineService.deleteMedicine(id), setLoading)
            .then(() => {
                setLoadIndex(loadIndex + 1);
                notification.success("Xoá thông tin thuốc thành công!");
            })
            .catch(message => {
                notification.error(message);
            });
    }

    useEffect(() => {
        handleApi(() => medicineService.getMedicines(), setLoading)
            .then(data => {
                setMedicines(data.map(item => ({
                    key: item['id'],
                    Name: item['name'],
                    Unit: item['unit'],
                    Quantity: item['quantity'],
                })));
            });
    }, [loadIndex]);

    return (
        <Spin spinning={loading}>
            {notificationContext}
            <Row>
                <Col span={24}>
                    <Card title="Danh sách thuốc">
                        <Form>
                            <Row gutter={[8, 0]}>
                                <Col span={6}>
                                    <Form.Item label="Tên thuốc">
                                        <Input
                                            value={medicine.Name}
                                            name="Name"
                                            onChange={e => handleInputData(e, medicine, setMedicine)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Đơn vị">
                                        <Input
                                            value={medicine.Unit}
                                            name="Unit"
                                            onChange={e => handleInputData(e, medicine, setMedicine)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item label="Số lượng">
                                        <InputNumber
                                            min={1}
                                            value={medicine.Quantity}
                                            onChange={value => handleInputNumber(value, medicine, setMedicine, "Quantity")}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item>
                                        <Space>
                                            <Button onClick={() => setMedicine(emptyMedicine)}>Thêm mới</Button>
                                            <Button onClick={save}>Lưu</Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            columns={userColumns}
                            dataSource={medicines}
                            rowClassName={(medicine) => medicine['key'] === medicineKeySelected ? 'bg-blue-100' : ''}
                        />
                    </Card>
                </Col>
            </Row>
        </Spin>
    );
}

export default Medicine;