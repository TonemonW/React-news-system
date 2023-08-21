import React from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import News from '../views/news/News'
import Detail from '../views/news/Detail'

export default function IndexRouters() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/detail" element={<Detail />} />
                <Route path="/news" element={<News />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={localStorage.getItem('token') ? <NewsSandBox /> : <Navigate to="/Login" />} />
            </Routes>
        </HashRouter>
    )
}
