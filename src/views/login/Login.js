import React, { useState, } from 'react'
import ParticleBackground from './ParticleBackground'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Form, Button, Input, Checkbox, Space, message } from 'antd'
import {
    UserOutlined, LockOutlined
} from '@ant-design/icons'
import './Login.css'
const formItemLayout = {
    wrapperCol: {
        style: { display: 'flex', alignItems: 'center' },
    },
};


export default function Login() {
    const navigate = useNavigate()
    const [rememberMe, setRememberMe] = useState(true)
    const savedUsername = localStorage.getItem('username')
    const savedPassword = localStorage.getItem('password')
    const onFinish = (values) => {
        axios.get(`/users?username=${values.username}&password=${values.password}&rollState=true&_expand=role`).then(res => {
            if (res.data.length === 0) {
                message.open({
                    type: 'error',
                    content: "username or password is wrong",
                    style: {
                        marginTop: '20vh',
                    }
                })
            } else {
                localStorage.setItem("token", JSON.stringify(res.data[0]))
                if (rememberMe) {
                    localStorage.setItem("password", values.password)
                    localStorage.setItem("username", values.username)
                } else {
                    localStorage.removeItem("password")
                    localStorage.removeItem("username")
                }
                navigate("/home")
            }
        })
    }
    return (
        <div className='container'>
            <ParticleBackground />
            <div className='formContainer'>
                <div className='loginTitle'>Global News Stystem</div>
                <Form
                    {...formItemLayout}
                    initialValues={{
                        username: savedUsername,
                        password: savedPassword,
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" style={{
                            width: 300,
                        }} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                            style={{
                                width: 300,
                            }}
                        />
                    </Form.Item>
                    <Space direction='horizontal' size={"large"} align='center' style={{ marginLeft: '150px' }}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox style={{ color: 'white' }} onChange={(e) => setRememberMe(e.target.checked)}>Remember me</Checkbox>
                            </Form.Item>
                        </Form.Item>
                    </Space>
                </Form>
            </div>
        </div>
    )
}
