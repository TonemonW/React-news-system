import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useLocation } from 'react-router-dom'

import { Layout } from 'antd'
import NewsRouter from '../../components/sandbox/NewsRouter'
const { Content } = Layout

export default function NewsSandBox() {
    const location = useLocation()
    NProgress.start()
    useEffect(() => {
        return () => {
            NProgress.done()
        }
    }, [location])
    return (
        <Layout style={{ height: '100vh' }}>
            <SideMenu></SideMenu>
            <Layout>
                <TopHeader></TopHeader>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: "white",
                        overflow: "auto"
                    }}
                ><NewsRouter></NewsRouter>
                </Content>

            </Layout>
        </Layout>
    )
}
