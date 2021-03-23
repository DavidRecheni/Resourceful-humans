import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip';

export default function Icon({ component, tooltip, style, active, ...props }) {

    const [hover, setHover] = useState(false)
    const [hoverStyles, setHoverStyles] = useState({})

    useEffect(() => {
        setHoverStyles({ color: active? 'DeepSkyBlue' : hover ? 'lightblue' : 'white' })
    }, [hover, active])

    return <>
        {React.createElement(component,
            {
                ...props,
                'data-tip': tooltip,
                onMouseEnter: _ => setHover(true),
                onMouseLeave: _ => setHover(false),
                style: {
                    fontSize: '2em', cursor: 'pointer',
                    ...hoverStyles, 
                    ...style
                }
            }
        )}
        <ReactTooltip />
    </>

}