import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Tree } from 'antd'
import {
    DeleteOutlined, AlignRightOutlined, ExclamationCircleFilled
} from '@ant-design/icons'
const { confirm } = Modal
export default function RoleList() {
    const [dataSource, setDataSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentRight, setCurrentRight] = useState([])
    const [currentId, setCurrentId] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    useEffect(() => {
        axios.get("/roles").then(res => {
            setDataSource(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setRightList(res.data)
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            },
            width: 250,
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            width: 350,
        },
        {
            title: '操作',
            render: (item) => {
                return <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button type="primary" shape="circle" icon={<AlignRightOutlined />} style={{ marginRight: '220px' }} onClick={() => {
                        setIsModalOpen(true)
                        setCurrentRight(item.rights)
                        setCurrentId(item.id)
                    }} />
                    <Button shape="circle" icon={<DeleteOutlined />} danger onClick={() => confirmDelete(item)} disabled={item.roleType === 1} />

                </div>
            }
        },
    ]
    const confirmDelete = (item) => {
        confirm({
            title: 'Are you sure you want to delete the ' + item.roleName + ' role?',
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
        axios.delete(`/roles/${item.id}`)

    }
    const handleOk = (item) => {
        setIsModalOpen(false)
        setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRight
                }
            } return item
        }))
        axios.patch(`/roles/${currentId}`, {
            rights: currentRight
        })

    }
    const handleCancel = () => { setIsModalOpen(false) }
    const onCheck = (rights) => {
        setCurrentRight(rights.checked)
    }
    return (
        <div>
            <Table rowKey={(item) => item.id} dataSource={dataSource} columns={columns} pagination={{ pageSize: 10 }} scroll={{
                y: 550,
            }} />;
            <Modal title="权限分配 " open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRight}
                    onCheck={onCheck}
                    treeData={rightList}
                    checkStrictly
                />
            </Modal>
        </div>
    )
}