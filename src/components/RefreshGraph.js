import React from 'react'
import { IoIosRefreshCircle } from 'react-icons/io'
import Icon from './styled/Icon'

const updateNodes = (pendingChanges, dataSetter, service) => {
    dataSetter(data => service.updateNodes(pendingChanges, data))
}
export default function RefreshGraph({ service, pendingChanges, dataSetter }) {
    return (
        <Icon
            style={{ marginBottom: 10 }}
            tooltip="Re-create graph"
            component={IoIosRefreshCircle}
            onClick={() => updateNodes(pendingChanges, dataSetter, service)}
        />
    )
}
