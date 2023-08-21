import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, notification, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
    DeleteOutlined, ExclamationCircleFilled, UploadOutlined, EditOutlined
} from '@ant-design/icons'
export default function NewsPublish(props) {
    const { publishState } = props;
    const { confirm } = Modal;
    const [dataSource, setDataSource] = useState([])
    const [api, contextHolder] = notification.useNotification()
    const navigate = useNavigate()
    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${publishState}&_expand=category`).then(res => {
            setDataSource(res.data)
        })
    }, [username, publishState])
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
                    {publishState !== 2 && (
                        <div>
                            <Button
                                type='primary'
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={() => navigate(`/news-manage/update/${item.id}`)}
                                style={{ marginRight: '20px' }}
                            />
                            <Button
                                shape="circle"
                                type='primary'
                                icon={<UploadOutlined />}
                                onClick={() => handlePublish(item)}
                                style={{ marginRight: '20px' }}
                            />
                        </div>
                    )}
                    <Button shape="circle" type='primary' icon={<DeleteOutlined />} onClick={() => confirmDelete(item, publishState)} danger></Button>

                </div>
            }
        },
    ]
    const confirmDelete = (item, publishState) => {
        confirm({
            title: 'Are you sure you want to delete the news ' + item.title + ' ?',
            icon: <ExclamationCircleFilled />,
            content: '',
            okType: 'danger',
            onOk() {
                if (publishState !== 2) {
                    deleteMethod(item)
                }
                else {
                    handleRemove(item)
                }
            },
            onCancel() {
            },
        });

    }
    const deleteMethod = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
        api.open({
            message: 'Successfully deleted',
            description:
                'Your news has been deleted',
            duration: 3,
            style: {
                marginTop: '80vh',
            }
        })
    }
    const handleRemove = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            publishState: 3
        }).then(res => {
            api.open({
                message: 'Successfully removed',
                description:
                    'Your news has been removed',
                duration: 3,
                style: {
                    marginTop: '80vh',
                }
            })
        })
    }
    const handlePublish = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            publishState: 2
        }).then(res => {
            api.open({
                message: 'Successfully published',
                description:
                    'Your news has been published, please wait for review',
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