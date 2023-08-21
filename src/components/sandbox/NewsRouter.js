import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import axios from 'axios'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import NotFound from '../../views/sandbox/notfound/NotFound'
import { Route, Routes, Navigate } from 'react-router-dom'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Published from '../../views/sandbox/publish-manage/Published'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Removed from '../../views/sandbox/publish-manage/Removed'
import { connect } from 'react-redux'

const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "*": NotFound,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/removed": Removed
}
function NewsRouter(props) {
    const [BackRouteList, setBackRouteList] = useState([])
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        const fetchBackRouteList = async () => {
            try {
                const [rightsRes, childrenRes] = await Promise.all([
                    axios.get("/rights"),
                    axios.get("/children"),
                ]);
                const mergedData = [...rightsRes.data, ...childrenRes.data]
                setBackRouteList(mergedData);
            } catch (error) {
                console.error("Error fetching route data:", error)
            }
        };
        fetchBackRouteList();
    }, []);
    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }
    return (
        <Spin size="large" spinning={props.isLoading}>
            <Routes>
                {
                    BackRouteList.map(item => {
                        if (checkRoute(item) && checkUserPermission(item)) {
                            return <Route path={item.key} key={item.key} Component={LocalRouterMap[item.key]} exact />
                        }
                        return null
                    }
                    )
                }
                <Route path="/" element={<Navigate to="/home" />} exact />
                {BackRouteList.length > 0 && <Route path="*" element={<NotFound />} />}
            </Routes>
        </Spin>
    )
}
const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
    return {
        isLoading
    }
}
export default connect(mapStateToProps)(NewsRouter)