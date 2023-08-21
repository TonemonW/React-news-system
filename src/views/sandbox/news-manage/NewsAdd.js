import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout'
import { Descriptions } from "antd"
import { Button, Steps, Input, Form, Select, message, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import style from './News.module.css'
import NewsEditor from '../../../components/news-manage/NewsEditor'
export default function NewsAdd() {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [content, setContent] = useState("")
    const [componentDisabled, setComponentDisabled] = useState(false)
    const [formInf, setFormInf] = useState({})
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const [api, contextHolder] = notification.useNotification()
    const user = JSON.parse(localStorage.getItem("token"))
    const selectedCategory = categoryList.find(category => category.id === formInf.categoryId);
    const handleNext = () => {
        if (current === 0) {
            form.validateFields().then(res => {
                setFormInf(res)
                setCurrent(current + 1)
            }).catch(error => {
                message.open({
                    type: 'error',
                    content: "Please fill in all required fields",
                    style: {
                        marginTop: '15vh',
                    }
                })
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.open({
                    type: 'error',
                    content: "Please enter your content",
                    style: {
                        marginTop: '15vh',
                    }
                })
            }
            else {
                setComponentDisabled(true)
                setCurrent(current + 1)
            }
        }

    }

    const handlePrevious = () => {
        setCurrent(current - 1)
        setComponentDisabled(false)
    }
    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategoryList(res.data)
        })
    }, [])
    const openNotification = (auditState) => {
        auditState === 0 ? api.open({
            message: 'Saved successfully',
            description:
                'Your news content has been successfully saved to the draft box',
            duration: 3,
            style: {
                marginTop: '80vh',
            }
        }) : api.open({
            message: 'Submitted successfully',
            description:
                'Your news content has been successfully submitted, please wait for review',
            duration: 3,
            style: {
                marginTop: '80vh',
            }
        })
    }
    const handleSave = (auditState) => {
        axios.post('/news', {
            ...formInf,
            "content": content,
            "auditState": auditState,
            "author": user.username,
            "createTime": Date.now(),
            "publishState": 0,
            "publishTime": 0,
            "region": user.region,
            "roleId": user.roleId,
            "star": 0,
            "view": 0
        }).then(res => {
            openNotification(auditState)
            setTimeout(() => {
                const key = auditState === 0 ? "/news-manage/draft" : "/audit-manage/list"
                navigate(key)
            }, 1000)
        })
    }
    return (
        <div>
            {contextHolder}
            <h1>Add News</h1>
            <Steps
                current={current}
                items={[
                    {
                        title: 'Basic',
                        description: "Enter news title, select news category",
                    },
                    {
                        title: 'Content',
                        description: "Enter the main content of the news",
                    },
                    {
                        title: 'Submit',
                        description: "Save draft or submit for review",
                    },
                ]}
            />
            <div className={current === 0 ? '' : style.active} style={{ marginTop: "80px", height: "150px" }}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ title: '', categoryId: '' }}
                    form={form}
                    disabled={componentDisabled}
                >
                    <Form.Item
                        label="News Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input your news title' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="News Category"
                        name="categoryId"
                        rules={[{ required: true, message: 'Please select your news category' }]}
                    >
                        <Select
                            options={categoryList.map((category) => ({
                                value: category.id,
                                label: category.title,
                                key: category.id,
                            }))}
                        />

                    </Form.Item>
                </Form>
            </div>
            <div className={current === 1 ? '' : style.active} style={{ marginTop: "80px", height: "300px" }}>
                <div style={{ height: "100%", overflowY: "auto" }}>
                    <NewsEditor getContent={(value) => { setContent(value) }} content={content} />
                </div>
            </div>
            <div className={current === 2 ? '' : style.active} style={{ marginTop: "10px", width: "600px" }}>
                {selectedCategory && (<PageHeader
                    ghost={false}
                    title={formInf.title}
                    subTitle={selectedCategory.title}
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="Author">{user.username}</Descriptions.Item>
                        <Descriptions.Item label="Region">{user.region}</Descriptions.Item>
                    </Descriptions>
                </PageHeader>)}
                <div
                    dangerouslySetInnerHTML={{
                        __html: content,
                    }}
                    style={{ border: "1px solid purple" }}
                ></div>
            </div>
            <div style={{ marginTop: "50px" }}>
                {current > 0 && <Button type='primary' onClick={handlePrevious}>Previous</Button>}
                {current < 2 && <Button type='primary' onClick={handleNext} >Next</Button>}
                {current === 2 && <span>
                    <Button type='primary' onClick={() => handleSave(0)}>Save draft</Button>
                    <Button danger onClick={() => handleSave(1)}>Submit</Button>
                </span>}
            </div>
        </div >
    )
}
