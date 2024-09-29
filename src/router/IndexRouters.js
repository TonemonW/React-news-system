import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../views/login/Login';
import NewsSandBox from '../views/sandbox/NewsSandBox';
import News from '../views/news/News';
import Detail from '../views/news/Detail';

export default function IndexRouters() {
    const token = localStorage.getItem('token');  // 获取 token 只在组件加载时运行一次

    return (
        <HashRouter>
            <Routes>
                {/* 公共路由 */}
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/news" element={<News />} />
                <Route path="/login" element={<Login />} />

                {/* 默认路径重定向 */}
                <Route path="/" element={<Navigate to={"/login"} />} />

                {/* 受保护的路由 */}
                <Route path="*" element={token ? <NewsSandBox /> : <Navigate to="/login" />} />
            </Routes>
        </HashRouter>
    );
}

