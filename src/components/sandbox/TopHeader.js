import React from 'react'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Button, Dropdown, Space, Avatar } from 'antd'
import {
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons'
const { Header } = Layout

function TopHeader(props) {
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
    const navigate = useNavigate()
    const changeCollapsed = () => {
        props.changeCollapsed();
    };
    const onClick = ({ key }) => {
        if (key === '2') {
            localStorage.removeItem("token")
            navigate('/login')
        } else { }
    }
    const items = [
        {
            label: roleName,
            key: '1',
            disabled: true,
            style: { fontSize: '16px', fontWeight: 'bold', color: 'black' },
        },
        {
            label: 'Logout',
            key: '2',
            danger: true,
        }
    ]

    return (
        <Header
            style={{
                marginTop: "10px",
                padding: 0,
                background: "white",
            }}
        >
            <Button
                type="text"
                icon={props.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={changeCollapsed}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <div style={{ float: "right" }}>
                <span>Welcome <b style={{ color: "#0469c6" }}>{username}</b> back</span>
                <Dropdown menu={{ items, onClick }}>
                    <a href="https://example.com" onClick={(e) => e.preventDefault()} style={{ padding: '10px' }} >
                        <Space>
                            <Avatar size="large" icon={<UserOutlined />} />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        </Header >
    )
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}
const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed"
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)