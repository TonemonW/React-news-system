import React, { useContext, useEffect, useRef, useState } from 'react'
import { Table, Button, Modal, Form, Input } from 'antd'
import axios from 'axios'
import {
    DeleteOutlined, ExclamationCircleFilled
} from '@ant-design/icons';
const { confirm } = Modal;
export default function NewsCategory() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get("/categories").then(res => {
            const list = res.data
            setDataSource(list)
        })
    }, [])
    const handleSave = (record) => {
        setDataSource(dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    title: record.title,
                    value: record.title
                }
            }
            return item
        }))
        axios.patch(`/categories/${record.id}`, {
            title: record.title,
            value: record.title
        })
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            },
        },
        {
            title: 'Category',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: 'Category',
                handleSave: handleSave
            }),
        },
        {
            title: '',
            render: (item) => {
                return <div>
                    <Button shape="circle" icon={<DeleteOutlined />} danger
                        onClick={() => confirmDelete(item)} />
                </div>
            }
        },
    ];
    const confirmDelete = (item) => {
        confirm({
            title: 'Are you sure you want to delete the category ' + item.title + ' ?',
            icon: <ExclamationCircleFilled />,
            content: '',
            okType: 'danger',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
            },
        });

    }
    const deleteMethod = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/categories/${item.id}`)
    }
    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>
    };
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 10 }} scroll={{
                y: 550,
            }} rowKey={item => item.id}
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }} />
        </div>
    )
}
