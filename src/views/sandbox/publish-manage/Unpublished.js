import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'

export default function Unpublished() {
    return (
        <div>
            <NewsPublish publishState={1}></NewsPublish>
        </div>
    )
}
