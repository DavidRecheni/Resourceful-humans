import { useEffect, useState, Suspense, useReducer } from 'react'

// components
import { ContainerInput } from './styled/ContainerInput'
import { ContainerColumn } from './styled/ContainerColumn'
import AddElement from './AddElement'
import ModifyName from './ModifyName'
import RefreshGraph from './RefreshGraph'
import Graph from './Graph'

const NTMInit = { nodes: [], links: [] }

function NTMReducer(state, action) {
    switch (action.type) {

        case 'NEW_NAME':
            return { ...state, newId: action.payload };

        case 'SET_NODE':
            return { oldId: action.payload, newId: action.payload };

        case 'ADD_PLANET':
            return { ...state, nodes: [{ id: action.payload, group: 2 }] };

        case 'RESET':
            return NTMInit

        default:
            throw new Error();
    }
}

export default function Main({ service }) {

    // Data
    const [data, setData] = useState()
    const [pendingChanges, setPendingChanges] = useState({ nodes: [], links: [], replace: [] })

    // Aux
    const [nodeToModify, dispatchNodeToModify] = useReducer(NTMReducer, NTMInit);

    // Hooks -----------------------------------------------------------------------------------

    useEffect(() => {
        service.getData(setData)
    }, [service])

    // Bloom effect -------------------------------------


    return (
        <Suspense fallback={<h1>Loading..</h1>}>

            <Graph data={data} dispatchNTM={dispatchNodeToModify} />

            <ContainerInput bottom hCenter>
                <ModifyName
                    node={[nodeToModify, dispatchNodeToModify]}
                    dispatchNTM={dispatchNodeToModify}
                    setter={setPendingChanges}
                />
            </ContainerInput>

            <ContainerInput bottom left>
                <ContainerColumn>
                    <RefreshGraph service={service} pendingChanges={pendingChanges} dataSetter={setData} />
                    <AddElement setPendingChanges={setPendingChanges} />
                </ContainerColumn>
            </ContainerInput>
            
        </Suspense>
    )
}
