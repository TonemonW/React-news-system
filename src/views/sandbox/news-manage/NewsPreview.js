import React, { useEffect, useState } from "react"
import { PageHeader } from '@ant-design/pro-layout'
import { Descriptions } from "antd"
import axios from "axios"
import { useMatch } from "react-router-dom"
import moment from "moment"

export default function NewsPreview(props) {
    const match = useMatch('/news-manage/preview/:id')
    const [newsInf, setNewsInf] = useState({})
    const auditList = ["Unaudited", "Processing", "Passed", "Failed"]
    const pulishList = ["Unpublished", "Publishable", "Published", "Removed"]
    const colorList = ["gray", "orange", "green", "red"]
    useEffect(() => {
        axios.get(`/news/${match.params.id}?_expand=role&_expand=category`).then((res) => {
            setNewsInf(res.data)
        })
    }, [match.params.id])


    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInf.title}
                subTitle={newsInf?.category?.value}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="Author">{newsInf.author}</Descriptions.Item>
                    <Descriptions.Item label="Create time">
                        {moment(newsInf.createTime).format("yyyy-MM-DD HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Publish time">
                        {newsInf.publishTime
                            ? moment(newsInf.publishTime).format("yyyy-MM-DD HH:mm:ss")
                            : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Region">{newsInf.region}</Descriptions.Item>
                    <Descriptions.Item label="Audit state">
                        <span style={{ color: colorList[newsInf.auditState] }}>
                            {auditList[newsInf.auditState]}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Publish state">
                        <span style={{ color: colorList[newsInf.publishState] }}>
                            {pulishList[newsInf.publishState]}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="View">{newsInf.view}</Descriptions.Item>
                    <Descriptions.Item label="Like">{newsInf.star}</Descriptions.Item>
                    <Descriptions.Item label="Comments">0</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div
                dangerouslySetInnerHTML={{
                    __html: newsInf.content,
                }}
                style={{ border: "1px solid purple" }}
            ></div>
        </div>
    );
}