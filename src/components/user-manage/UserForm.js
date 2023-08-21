import React, { forwardRef, useState } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select;
const PasswordRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
const validatePassword = (_, value) => {
    if (!value || PasswordRule.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject(new Error('The password must be at least 8 characters long and contain at least one letter and one number!'));
};
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};
const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setIsDisabled] = useState(false)
    const { roleId, region } = JSON.parse(localStorage.getItem("token"))
    const CheckRegion = (item) => {
        if (roleId === 1) {
            return false
        } else {
            return item.value !== region
        }
    }
    const CheckRole = (item) => {
        if (roleId === 1) {
            return false
        } else {
            return item.id !== 3
        }
    }
    const handleRoleChange = (value) => {
        if (value === 1) {
            setIsDisabled(true);
            ref.current.setFieldsValue({
                region: 'Global',
            });
        } else {
            setIsDisabled(false);
        }
    };
    return (
        <Form
            ref={ref}
            {...formItemLayout}
            style={{
                maxWidth: 800,
            }}
        >
            <Form.Item
                name="username"
                label="Username"
                rules={[
                    {
                        required: true,
                        message: 'Please enter your username',
                    },
                    {
                        validator: props.checkUsernameExists,
                    },
                ]}>
                <Input style={{
                    width: 200,
                }} />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please enter your password',
                    },
                    {
                        validator: validatePassword,
                    },
                ]}>
                <Input.Password style={{
                    width: 200,
                }} />
            </Form.Item>
            <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The new password that you entered do not match!'))
                        },
                    }),
                ]}
            >
                <Input.Password style={{
                    width: 200,
                }} />
            </Form.Item>
            <Form.Item
                name="roleId"
                label="Role"
                rules={[
                    {
                        required: true,
                        message: 'Please select a role',
                    },
                ]}>
                <Select style={{ width: 150, }} onChange={handleRoleChange}>
                    {props.roleList.map(item =>
                        <Option value={item.id} key={item.id} disabled={CheckRole(item)}>{item.roleName}</Option>
                    )}
                </Select>
            </Form.Item>
            <Form.Item
                name="region"
                label="Region"
                rules={isDisabled ? [] : [{
                    required: true,
                    message: 'Please select a region',
                }]}>
                <Select style={{ width: 150, }} disabled={isDisabled}>
                    {props.regionList.map(item =>
                        <Option value={item.value} key={item.id} disabled={CheckRegion(item)}>{item.title}</Option>
                    )}
                </Select>
            </Form.Item>

        </Form>
    )
})
export default UserForm