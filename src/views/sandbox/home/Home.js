import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Typography, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import axios from 'axios'
import *as Echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card
export default function Home() {
    const [viewList, setViewList] = useState([])
    const [likeList, setLikeList] = useState([])
    const [allList, setAllList] = useState([])
    const [open, setOpen] = useState(false)
    const { role: { roleName }, region, username } = JSON.parse(localStorage.getItem("token"))
    const barRef = useRef()
    const pieRef = useRef()
    useEffect(() => {
        axios.get("http://localhost:5000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
            setViewList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get("http://localhost:5000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
            setLikeList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category").then((res) => {
            renderBarView(_.groupBy(res.data, (item) => item.category.title))
            setAllList(res.data)
        })
        return () => {
            window.onresize = null
        }

    }, [])
    const renderBarView = (obj) => {
        var myChart = Echarts.init(barRef.current)
        var option = {
            title: {
                text: 'Totle News Number'
            },
            tooltip: {},
            legend: {
                data: ['Number']
            },
            xAxis: {
                data: Object.keys(obj),

            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: 'Number',
                    type: 'bar',
                    data: Object.values(obj).map((item) => item.length)
                }
            ]
        }
        myChart.setOption(option)
        window.onresize = () => {
            myChart.resize()
        }
    }
    const renderPieView = (obj) => {
        var currentList = allList.filter(item => item.author === username)
        var groupObj = _.groupBy(currentList, item => item.category.title)
        var list = []
        for (var i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length
            })
        }
        var myChart = Echarts.init(pieRef.current)
        var option = {
            title: {
                text: 'Your News',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Number',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        option && myChart.setOption(option)
    }

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Most View" bordered={true}>
                        <List
                            dataSource={viewList}
                            renderItem={(item) => (
                                <List.Item>
                                    <Typography.Text keyboard>[{item.category.title}]</Typography.Text> <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Most Like" bordered={true}>
                        <List
                            dataSource={likeList}
                            renderItem={(item) => (
                                <List.Item>
                                    <Typography.Text keyboard>[{item.category.title}]</Typography.Text> <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                setOpen(true)
                                setTimeout(() => {
                                    renderPieView()
                                }, 0)
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                            title={username}
                            description={
                                <div>
                                    <b style={{ fontSize: "16px", color: "brown" }}>{region}</b> <span style={{ fontSize: "14px", color: "gold" }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer width="550px" title="Your News" placement="right" onClose={() => { setOpen(false) }} open={open}>
                <div ref={pieRef} style={{
                    height: "400px",
                    marginTop: "30px"
                }}>
                </div>
            </Drawer>
            <div ref={barRef} style={{
                width: "100vh",
                height: "400px",
                marginTop: "30px"
            }}></div>
        </div >
    )
}
