import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout'
import axios from "axios"
import { Card, Col, Row, List, Button } from 'antd'
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'

export default function News() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category").then(res => {
            setDataSource(Object.entries(_.groupBy(res.data, (item) => item.category.title)))
        })
    }, [])
    const navigate = useNavigate()
    return (
        <div>
            <PageHeader
                title={"News"}
                subTitle={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button style={{ float: "right" }} type="primary" onClick={() => navigate('/Login')}>Login</Button>
                    </div>
                }
            >
                <Row gutter={[16, 16]}>
                    {dataSource.map(item => {
                        return (<Col span={8} key={item[0]}>
                            <Card
                                title={item[0]}
                                bordered={true}
                                hoverable={true}
                            >
                                <List
                                    size="small"
                                    dataSource={item[1]}
                                    pagination={{
                                        pageSize: 3
                                    }}
                                    renderItem={data =>
                                        <List.Item>
                                            <a href={`#/detail/${data.id}`}> {data.title}</a>
                                        </List.Item>}
                                />
                            </Card>
                        </Col>)
                    })}
                </Row>
            </PageHeader>
        </div>
    )
}
