import React from 'react'
import { FaSave } from 'react-icons/fa'
import Icon from './styled/Icon'


export default function ModifyName({ node, inputHandler, setter }) {

    const updateName = node => {
        setter(pending => { return { ...pending, replace: [...pending.replace, node] } })
    }

    return (
        <>
            {node.oldId &&
                <>
                    <input
                        value={node.newId}
                        style={{ color: 'white', background: 'none' }}
                        onChange={inputHandler}
                    />

                    <Icon
                        tooltip="Save changes"
                        component={FaSave}
                        onClick={_ => updateName(node)}
                        style={{ marginLeft: 10, display: node.oldId === node.newId ? 'none' : 'flex' }}
                    />
                </>
            }
        </>
    )
}
