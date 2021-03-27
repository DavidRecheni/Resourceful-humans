import { useRef, useCallback, useEffect, useState, Suspense, useReducer } from 'react'

// libs
import ForceGraph3D from 'react-force-graph-3d'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

// components
import { ContainerInput } from './styled/ContainerInput'
import { ContainerColumn } from './styled/ContainerColumn'
import AddElement from './AddElement'
import ModifyName from './ModifyName'
import RefreshGraph from './RefreshGraph'


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


    const fgRef = useRef()

    // Handlers --------------------------------------------------------------------------------
    const handleNameInput = name => {
        dispatchNodeToModify({ type: 'NEW_NAME', payload: name.target.value })
    }

    const handleClick = useCallback(node => {
        // Aim at node from outside it
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        fgRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({x, y, z})
            3000  // ms transition duration
        );

        dispatchNodeToModify({ type: 'SET_NODE', payload: node.id })
    }, [fgRef])

    // Hooks -----------------------------------------------------------------------------------

    useEffect(() => {
        service.getData(setData)
    }, [service])

    // Bloom effect -------------------------------------
    useEffect(() => {
        const bloomPass = new UnrealBloomPass();
        bloomPass.strength = 1;
        bloomPass.radius = 1;
        bloomPass.threshold = 0.1;
        fgRef.current.postProcessingComposer().addPass(bloomPass);
    }, []);

    return (
        <Suspense fallback={<h1>Loading..</h1>}>
            <ForceGraph3D
                ref={fgRef}
                graphData={data}
                nodeLabel="id"
                nodeAutoColorBy="group"
                onNodeClick={handleClick}
            />

            <ContainerInput bottom hCenter>
                <ModifyName
                    node={[nodeToModify, dispatchNodeToModify]}
                    inputHandler={handleNameInput}
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
