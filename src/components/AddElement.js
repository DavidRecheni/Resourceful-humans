import React, { useState } from 'react'
import styled from 'styled-components'

import Icon from './styled/Icon'

import { IoAddCircle, IoPlanetSharp } from 'react-icons/io5'
import { FaLink } from 'react-icons/fa'
import { RiMovie2Fill } from 'react-icons/ri'

const OpenButton = styled.div`
    position: relative;
    z-index: 2;
`
const NavOption = styled.div`
    bottom: -15px;
    position: absolute;
    z-index: 1;
    transition: all 150ms ease-out;
    font-size: .8em;`

const ContainerInput = styled.div`
    z-index: 1;
    position: absolute;
    bottom: 45px;
    left: 50px;
`

const OPTIONS = {
    ADD_LINK: 1,
    ADD_PLANET: 2,
    ADD_FILM: 3
}

export default function AddElement() {

    const [showOptions, setShowOptions] = useState(false)

    const [selectedOption, setSelectedOption] = useState(false)

    const elements = [
        { component: FaLink, option: OPTIONS.ADD_LINK, tooltip: "Add Link" },
        { component: IoPlanetSharp, option: OPTIONS.ADD_PLANET, tooltip: "Add Planet" },
        { component: RiMovie2Fill, option: OPTIONS.ADD_FILM, tooltip: "Add Film" }
    ]

    const SelectOption = (option) => {
        switch (option) {
            case OPTIONS.ADD_LINK:
                return <input
                    placeholder='Add Link'
                />;

            case OPTIONS.ADD_PLANET:
                return <input
                    placeholder='Add Planet'
                />;

            case OPTIONS.ADD_FILM:
                return <input
                    placeholder='Add Film'
                />;

            default: return null;
        }
    }

    return (
        <div>
            <OpenButton onClick={_ => setShowOptions(!showOptions)}>
                <Icon
                    active={showOptions}
                    component={IoAddCircle}
                />
            </OpenButton>

            { elements.map((e, i) =>
                <NavOption
                    key={i}
                    style={{ marginLeft: showOptions ? (i + 1) * 50 : 0 }}>
                    <Icon tooltip={e.tooltip}
                        active={selectedOption === e.option}
                        onClick={_ => setSelectedOption(e.option)}
                        style={{ opacity: showOptions ? 1 : 0 }}
                        component={e.component} />,
                </NavOption>)}

            {showOptions && <ContainerInput>
                {SelectOption(selectedOption)}
            </ContainerInput>}
        </div>
    )
}
