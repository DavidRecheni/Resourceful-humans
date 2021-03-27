import React, { useState, useReducer, useEffect } from 'react'
import styled from 'styled-components'

import Icon from './styled/Icon'

import { IoAddCircle, IoPlanetSharp } from 'react-icons/io5'
import { FaLink, FaSave } from 'react-icons/fa'
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
    display: flex;
`

const OPTIONS = {
    ADD_LINK: 1,
    ADD_PLANET: 2,
    ADD_FILM: 3
}

const menuItems = [
    { component: FaLink, option: OPTIONS.ADD_LINK, tooltip: "Add Link" },
    { component: IoPlanetSharp, option: OPTIONS.ADD_PLANET, tooltip: "Add Planet" },
    { component: RiMovie2Fill, option: OPTIONS.ADD_FILM, tooltip: "Add Film" }
]

const PEInit = { nodes: [], links: [] }

function PEReducer(state, action) {
    switch (action.type) {

        case 'ADD_LINK':
            return {
                ...state, links: [{ source: action.payload.source, target: action.payload.target }]
            };

        case 'ADD_FILM':
            return { ...state, nodes: [{ id: action.payload, group: 1 }] };

        case 'ADD_PLANET':
            return { ...state, nodes: [{ id: action.payload, group: 2 }] };

        case 'RESET':
            return PEInit

        default:
            throw new Error();
    }
}

export default function AddElement({ setPendingChanges }) {

    // Aux UI
    const [showOptions, setShowOptions] = useState(false)
    const [selectedOption, setSelectedOption] = useState(false)

    // Data
    const [inputValue, setInputValue] = useState('')
    const [inputValue2, setInputValue2] = useState('')

    const [pendingElements, dispatchPendingElements] = useReducer(PEReducer, PEInit);

    const SelectOption = (option) => {
        switch (option) {
            case OPTIONS.ADD_LINK:
                return <>
                    <input
                        placeholder='Link source'
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <input
                        placeholder='Link target'
                        value={inputValue2}
                        onChange={e => setInputValue2(e.target.value)}
                    />
                    <Icon
                        tooltip="Add link"
                        component={FaSave}
                        onClick={_ => {
                            dispatchPendingElements({ type: 'ADD_LINK', payload: { source: inputValue, target: inputValue2 } })
                            setInputValue('')
                            setInputValue2('')
                        }}
                        style={{ marginLeft: 10, display: inputValue !== '' && inputValue2 !== '' ? 'flex' : 'none' }}
                    />
                </>;

            case OPTIONS.ADD_PLANET:
                return <>
                    <input
                        placeholder='Planet name'
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <Icon
                        tooltip="Add planet"
                        component={FaSave}
                        onClick={_ => {
                            dispatchPendingElements({ type: 'ADD_PLANET', payload: inputValue })
                            setInputValue('')
                        }}
                        style={{ marginLeft: 10, display: inputValue !== '' ? 'flex' : 'none' }}
                    />
                </>;

            case OPTIONS.ADD_FILM:
                return <>
                    <input
                        placeholder='Film name'
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <Icon
                        tooltip="Add planet"
                        component={FaSave}
                        onClick={_ => {
                            dispatchPendingElements({ type: 'ADD_FILM', payload: inputValue })
                            setInputValue('')
                        }}
                        style={{ marginLeft: 10, display: inputValue !== '' ? 'flex' : 'none' }}
                    />
                </>;

            default: return null;
        }
    }

    // Hooks ---------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        if (pendingElements.nodes.length || pendingElements.links.length) {
            setPendingChanges(pending => { return { ...pending, nodes: [...pending.nodes, ...pendingElements.nodes], links: [...pending.links, ...pendingElements.links] } })
            dispatchPendingElements({ type: 'RESET' })
        }
    }, [pendingElements, setPendingChanges])

    return (
        <section>
            <OpenButton onClick={_ => {
                setSelectedOption(false)
                setShowOptions(!showOptions)
            }}>
                <Icon
                    active={showOptions}
                    component={IoAddCircle}
                />
            </OpenButton>

            { menuItems.map((e, i) =>
                <NavOption
                    key={i}
                    style={{ marginLeft: showOptions ? (i + 1) * 50 : 0 }}>
                    <Icon tooltip={e.tooltip}
                        active={selectedOption === e.option}
                        onClick={_ => setSelectedOption(e.option)}
                        style={{ opacity: showOptions ? 1 : 0 }}
                        component={e.component} />,
                </NavOption>)}

            {selectedOption && showOptions &&
                <ContainerInput>
                    {SelectOption(selectedOption)}
                </ContainerInput>}
        </section>
    )
}
