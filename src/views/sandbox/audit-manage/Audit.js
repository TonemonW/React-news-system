import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, notification } from 'antd'
import {
    CheckOutlined, CloseOutlined
} from '@ant-design/icons';
export default function Audit() {
    const [dataSource, setDataSource] = useState([])
    const [api, contextHolder] = notification.useNotification()
    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get('/news?auditState=1&_expand=category').then(res => {
            setDataSource(roleId === 1 ? res.data : [
                ...res.data.filter(item => item.author === username),
                ...res.data.filter(item => item.region === region && item.roleId === 3),
            ])
        })
    }, [roleId, region, username])
    const columns = [
        {
            title: 'News Title',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
            },
        },
        {
            title: 'Author',
            dataIndex: 'author',
        },
        {
            title: "News Category",
            dataIndex: 'category',
            render: (category => {
                return category.title
            })
        },
        {
            title: '',
            render: (item) => {
                return <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button type='primary' icon={<CheckOutlined />} style={{ marginRight: '20px', width: '80px' }} onClick={() => handleAudit(item, 2, 1)}>Pass</Button>
                    <Button icon={<CloseOutlined />} danger onClick={() => handleAudit(item, 3, 0)} style={{ width: '80px' }}>Reject</Button>

                </div>
            }
        },
    ]
    const handleAudit = (item, auditState, publishState) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState,
            publishState
        }).then(res => {
            auditState === 2 ? api.open({
                message: 'Passed successfully',
                description:
                    'The news has been passed',
                duration: 3,
                style: {
                    marginTop: '80vh',
                }
            })
                : api.open({
                    message: 'rejected successfully',
                    description:
                        'The news has been rejected',
                    duration: 3,
                    style: {
                        marginTop: '80vh',
                    }
                })
        })
    }

    return (
        <div>
            {contextHolder}
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 6 }} scroll={{
                y: 550,
            }} rowKey={item => item.id} />
        </div>
    )
}
