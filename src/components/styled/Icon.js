import {createElement, useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip';

export default function Icon({ component, tooltip, style, active, large, ...props }) {

    const [hover, setHover] = useState(false)
    const [hoverStyles, setHoverStyles] = useState({})

    useEffect(() => {
        setHoverStyles({ color: active ? 'DeepSkyBlue' : hover ? 'lightblue' : 'white' })
    }, [hover, active])

    return <>
        {createElement(component,
            {
                ...props,
                'data-tip': tooltip,
                onMouseEnter: _ => setHover(true),
                onMouseLeave: _ => setHover(false),
                style: {
                    fontSize: large? '3em': '1.8em',
                    cursor: 'pointer',
                    
                    ...hoverStyles,
                    ...style
                }
            }
        )}
        <ReactTooltip />
    </>

}