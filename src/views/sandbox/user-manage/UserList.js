import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Switch } from 'antd'
import {
    DeleteOutlined, ExclamationCircleFilled, EditOutlined
} from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
import UpdateForm from '../../../components/user-manage/UpdateForm'
const { confirm } = Modal


export default function UserList() {
    const [dataSource, setDataSource] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const [roleList, setRoleList] = useState([])
    const [regionList, setRegionList] = useState([])
    const [updateFormData, setUpdateFormData] = useState({})
    const [isDisabled, setIsDisabled] = useState(false)
    const addForm = useRef(null)
    const updateForm = useRef(null)
    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get("/users?_expand=role").then(res => {
            setDataSource(roleId === 1 ? res.data : [
                ...res.data.filter(item => item.username === username),
                ...res.data.filter(item => item.region === region && item.roleId === 3),
            ])
        })
    }, [roleId, region, username])
    useEffect(() => {
        axios.get("/roles").then(res => {
            setRoleList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get("/regions").then(res => {
            setRegionList(res.data)
        })
    }, [])
    const checkUsernameExists = async (_, value) => {
        try {
            const response = await axios.get(
                `/users?username=${value}`
            );
            if (response.data.length > 0) {
                throw new Error('Username already exists')
            }
            return Promise.resolve()
        } catch (error) {
            throw new Error('Username already exists')
        }
    };
    const columns = [
        {
            title: 'Region',
            dataIndex: 'region',
            filters: [
                ...regionList.map((region) => {
                    return {
                        text: region.title,
                        value: region.value,
                    };
                }),
            ],
            onFilter: (value, record) => {
                return record.region === value;
            },

            render: (region) => {
                return <b>{region}</b>
            },
        },
        {
            title: 'Role',
            dataIndex: 'role',
            render: (role) => {
                return role.roleName
            },
        },
        {
            title: 'Username',
            dataIndex: 'username',
        },
        {
            title: 'State',
            render: (item) => {
                return <div>
                    <Switch checkedChildren="open" unCheckedChildren="close" checked={item.roleState}
                        onChange={() => {
                            switchState(item)
                        }} disabled={item.default} />
                </div>
            }
        },
        {
            title: 'Handle',
            render: (item) => {
                return <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => {
                        handleUpdate(item)
                    }} />
                    <Button shape="circle" icon={<DeleteOutlined />} danger onClick={() => confirmDelete(item)} disabled={item.default} />
                </div>
            },
        }
    ]
    const confirmDelete = (item) => {
        confirm({
            title: 'Are you sure you want to delete the user ' + item.username + ' ?',
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
        axios.delete(`/users/${item.id}`)

    }
    const handleCancel = () => {
        setIsModalOpen(false)
        addForm.current.resetFields()
    }
    const updateCancel = () => {
        setIsUpdateOpen(false)
        updateForm.current.resetFields()
    }
    const addFormOk = () => {
        addForm.current.validateFields().then(value => {
            setIsModalOpen(false)
            axios.post(`/users`, {
                ...value,
                "default": false,
                "roleState": true,
            }).then(res => {
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === value.roleId)[0]
                }])
                addForm.current.resetFields();
            })
        }).catch(error => {
            console.log(error)
        })
    }
    const updateFormOk = () => {
        updateForm.current.validateFields().then(value => {
            axios.patch(`/users/${updateFormData.id}`,
                value)
            updateForm.current.resetFields();
            setDataSource(dataSource.map(item => {
                if (item.id === updateFormData.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(data => data.id === value.roleId)[0]
                    }
                }
                return item
            }))
            setIsUpdateOpen(false)
        })
            .catch((err) => {
                console.log(err);
            })
    }
    const switchState = (item) => {
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }
    useEffect(() => {
        if (isUpdateOpen && Object.keys(updateFormData).length > 0) {
            updateForm.current.setFieldsValue(updateFormData);
        }
    }, [isUpdateOpen, updateFormData]);
    useEffect(() => {
        if (updateFormData.roleId === 1) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [updateFormData.roleId]);

    const handleUpdate = (item) => {
        setIsUpdateOpen(true);
        setUpdateFormData(item);
    };
    return (
        <div>
            <Button type='primary' onClick={() => { setIsModalOpen(true) }}>添加用户</Button>
            <Table rowKey={(item) => item.id} dataSource={dataSource} columns={columns} pagination={{ pageSize: 6 }} scroll={{
                y: 550,
            }} />
            <Modal
                open={isModalOpen}
                title="Create a new user"
                okText="Ok"
                cancelText="Cancel"
                onCancel={handleCancel}
                onOk={addFormOk} >
                <UserForm regionList={regionList} roleList={roleList} ref={addForm} checkUsernameExists={checkUsernameExists}></UserForm>

            </Modal>
            <Modal
                open={isUpdateOpen}
                title="Change user's detail"
                okText="Update"
                cancelText="Cancel"
                onCancel={updateCancel}
                onOk={updateFormOk} >
                <UpdateForm regionList={regionList} roleList={roleList} ref={updateForm} isDisabled={isDisabled} checkUsernameExists={checkUsernameExists}></UpdateForm>

            </Modal>
        </div >
    )
}
