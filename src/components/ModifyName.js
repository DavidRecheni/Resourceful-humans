import React from 'react'
import { FaSave } from 'react-icons/fa'
import Icon from './styled/Icon'


export default function ModifyName({ node, setter, dispatchNTM }) {

    // Handlers --------------------------------------------------------------------------------
    const inputHandler = name => {
        dispatchNTM({ type: 'NEW_NAME', payload: name.target.value })
    }

    const updateName = node => {
        setter(pending => { return { ...pending, replace: [...pending.replace, node[0]] } })
        node[1]({ type: 'RESET' })
    }

    return (
        <>
            {node[0].oldId &&
                <>
                    <input
                        value={node[0].newId}
                        style={{ color: 'white', background: 'none' }}
                        onChange={inputHandler}
                    />

                    <Icon
                        tooltip="Save changes"
                        component={FaSave}
                        onClick={_ => updateName(node)}
                        style={{ marginLeft: 10, display: node[0].oldId === node[0].newId ? 'none' : 'flex' }}
                    />
                </>
            }
        </>
    )
}
