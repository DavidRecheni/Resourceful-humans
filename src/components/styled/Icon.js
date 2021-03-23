import React, { useState, useEffect } from 'react'

export default function Icon({ component, onClick }) {

    const [hover, setHover] = useState(false)
    const [hoverStyles, setHoverStyles] = useState({})

    useEffect(() => {
        setHoverStyles(hover ? {
            color: 'cyan'
        } :
            {})
    }, [hover])

    return React.createElement(
        component,
        {
            onClick: onClick,
            onMouseEnter: _ => setHover(true),
            onMouseLeave: _ => setHover(false),
            style: { color: 'white', fontSize: '2em', ...hoverStyles }
        }
    )

}