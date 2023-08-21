import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    DeleteOutlined, ExclamationCircleFilled, EditOutlined, UploadOutlined
} from '@ant-design/icons'
const { confirm } = Modal
export default function RightList() {
    const [dataSource, setDataSource] = useState([])
    const [api, contextHolder] = notification.useNotification();
    const { username } = JSON.parse(localStorage.getItem("token"))
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            const list = res.data
            setDataSource(list)
        })
    }, [username])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            },
        },
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
                    <Button type='primary' shape="circle" icon={<EditOutlined />}
                        onClick={() => navigate(`/news-manage/update/${item.id}`)} style={{ marginRight: '20px' }} />
                    <Button shape="circle" icon={<DeleteOutlined />} danger
                        onClick={() => confirmDelete(item)} style={{ marginRight: '20px' }} />
                    <Button shape="circle" icon={<UploadOutlined />}
                        onClick={() => handleCheck(item.id)} style={{ marginRight: '20px' }} />
                </div>
            }
        },
    ];
    const handleCheck = (id) => {
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(res => {
            api.open({
                message: 'Successfully Submitted',
                description:
                    'Your news content has been successfully submitted, please wait for review',
                duration: 3,
                style: {
                    marginTop: '80vh',
                }
            })
            setTimeout(() => { navigate("/audit-manage/list") }, 1000)
        })
    }
    const confirmDelete = (item) => {
        confirm({
            title: 'Are you sure you want to delete the news ' + item.title + ' ?',
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
        axios.delete(`/news/${item.id}`)
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