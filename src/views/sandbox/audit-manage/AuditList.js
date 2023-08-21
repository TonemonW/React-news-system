import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
    EditOutlined, UploadOutlined, DeleteOutlined
} from '@ant-design/icons';
export default function AuditList() {
    const [dataSource, setDataSource] = useState([])
    const [api, contextHolder] = notification.useNotification()
    const navigate = useNavigate()
    const { username } = JSON.parse(localStorage.getItem("token"))
    const colorList = [
        <Tag>Unaudited</Tag>,
        <Tag color="orange">Processing</Tag>,
        <Tag color="green">Passed</Tag>,
        <Tag color="red">Failed</Tag>,
    ]
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            setDataSource(res.data)
        })
    }, [username])
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
            title: "State",
            dataIndex: 'auditState',
            render: (auditState) => {
                return colorList[auditState]
            }
        },

        {
            title: '',
            render: (item) => {
                return <div style={{ display: 'flex', alignItems: 'center' }}>
                    {
                        item.auditState === 2 && <Button type='primary' icon={<UploadOutlined />} onClick={() => handlePublish(item)}>Publish</Button>
                    }
                    {
                        item.auditState === 3 && <Button icon={<EditOutlined />} onClick={() => handleUpdate(item)}>update</Button>
                    }
                    {
                        item.auditState === 1 && <Button type='primary' icon={<DeleteOutlined />} danger onClick={() => handleCancel(item)}>Cancel</Button>
                    }
                </div>
            }
        },
    ];
    const handleCancel = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            api.open({
                message: 'Cancelled successfully',
                description:
                    'Your news has been cancelled, please return to draft to review',
                duration: 3,
                style: {
                    marginTop: '80vh',
                }
            })
        })
    }
    const handleUpdate = (item) => {
        navigate(`/news-manage/update/${item.id}`)
    }
    const handlePublish = (item) => {
        axios.patch(`/news/${item.id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            api.open({
                message: 'Published successfully',
                description:
                    'Your news has been published, please go to published to review',
                duration: 3,
                style: {
                    marginTop: '80vh',
                }
            })
            setTimeout(() => { navigate("/publish-manage/published") }, 1000)
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
