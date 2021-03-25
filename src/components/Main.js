import { useRef, useCallback, useEffect, useState, Suspense } from 'react'

// libs
import ForceGraph3D from 'react-force-graph-3d'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

// components
import { ContainerInput } from './styled/ContainerInput'
import { ContainerColumn } from './styled/ContainerColumn'
import AddElement from './AddElement'
import ModifyName from './ModifyName'
import RefreshGraph from './RefreshGraph'

export default function Main({ service }) {

    // Data
    const [data, setData] = useState()
    const [pendingChanges, setPendingChanges] = useState({ nodes: [], links: [], replace: [] })

    // Aux
    // Store the original node to search and reeplace after changes
    const [nodeToModify, setNodeToModify] = useState({ oldId: '', newId: '' })

    const fgRef = useRef()

    // Handlers --------------------------------------------------------------------------------
    const handleNameInput = name => {
        setNodeToModify(nodes => { return { ...nodes, newId: name.target.value } })
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

        setNodeToModify({ newId: node.id, oldId: node.id })
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
                    node={nodeToModify}
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
