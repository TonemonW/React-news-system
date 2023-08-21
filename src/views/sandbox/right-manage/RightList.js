import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Switch } from 'antd'
import axios from 'axios'
import {
    DeleteOutlined, ExclamationCircleFilled
} from '@ant-design/icons'
const { confirm } = Modal
export default function RightList() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            const list = res.data
            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ""
                }
            })
            setDataSource(list)
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
            title: '权限名称',
            dataIndex: 'title',
            width: 250,
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="gold">{key}</Tag>
            },
            width: 250,
        },
        {
            title: '操作',
            render: (item) => {
                return <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Switch checkedChildren="open" unCheckedChildren="close" checked={item.pagepermisson} style={{ marginRight: '220px' }}
                        onChange={() => {
                            switchMethod(item)
                        }} disabled={item.pagepermisson === undefined} />
                    <Button shape="circle" icon={<DeleteOutlined />} danger
                        onClick={() => confirmDelete(item)} />
                </div>
            }
        },
    ];
    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        setDataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
    }
    const confirmDelete = (item) => {
        confirm({
            title: 'Are you sure you want to delete the ' + item.title + ' permission?',
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
        if (item.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`/rights/${item.id}`)
        } else {
            let list = dataSource.filter(data => data.id === item.rightId)
            if (list.length > 0) {
                list[0].children = list[0].children.filter(data => data.id !== item.id)
                setDataSource([...dataSource])
                axios.delete(`/children/${item.id}`)
            }
        }
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 10 }} scroll={{
                y: 550,
            }} />
        </div>
    )
}
