import React, { useEffect, useState } from 'react'
import './SideMenu.css'
import axios from 'axios'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    AppstoreOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
const { Sider } = Layout
const iconList = {
    "/home": <AppstoreOutlined />,
}
function getItem(title, key, children, type) {
    return {
        key,
        icon: iconList[key],
        children,
        label: title,
        type,
    };
}
const SideMenu = (props) => {
    const [menu, setMenu] = useState([])
    const [selectedKey, setSelectedKey] = useState(localStorage.getItem('selectedKey') || null)
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            console.log(res.data)
            setMenu(res.data)
        })
    }, [])

    const getMenuItems = (items) => {
        const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
        return items
            .filter(item => item.pagepermisson === 1 && rights.includes(item.key))
            .map(item => {
                if (item.children && item.children.length > 0) {
                    return getItem(item.title, item.key, getMenuItems(item.children), item.type)
                } else {
                    return getItem(item.title, item.key, undefined, item.type)
                }
            });
    };
    const items = getMenuItems(menu)
    const navigate = useNavigate()
    const onClick = (e) => {
        const { key } = e
        navigate(key)
        setSelectedKey(key)
        localStorage.setItem('selectedKey', key)
    };
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
                <div className='demo-logo-vertical'>Global News Stystem</div>
                <div style={{ flex: 1, overflow: "auto" }}>
                    <Menu
                        onClick={onClick}
                        mode="inline"
                        theme="dark"
                        items={items}
                        SelectedKeys={[selectedKey]}
                        defaultOpenKeys={["/" + selectedKey.split("/")[1]]}
                    />
                </div>
            </div>
        </Sider>
    )
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}
export default connect(mapStateToProps)(SideMenu)