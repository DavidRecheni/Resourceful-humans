import { useRef, useCallback, useEffect, useState, Suspense } from 'react'

// libs
import ForceGraph3D from 'react-force-graph-3d'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

// components
import { ContainerInput } from './styled/ContainerInput'
import { ContainerColumn } from './styled/ContainerColumn'
import AddElement from './AddElement'
import Icon from './styled/Icon'

// icons
import { FaSave } from 'react-icons/fa'
import { IoIosRefreshCircle } from 'react-icons/io'

export default function Main({ service }) {

    // Data
    const [data, setData] = useState()
    const [pendingChanges, setPendingChanges] = useState({ nodes: [], links: [], replace: [] })

    // Aux
    // Store the original node to search and reeplace after changes
    const [nodeToModify, setNodeToModify] = useState({ oldId: '', newId: '' })

    const fgRef = useRef()

    // Functions --------------------------------------------------------------------------------
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

        setNodeToModify(nodes => { return { newId: node.id, oldId: node.id } })
    }, [fgRef])

    const updateNodes = (node, data) => {
        const nodes = data.nodes
        nodes[node.index] = node
        setData({ ...data, nodes: nodes })
    }

    const updateName = node => {
        setPendingChanges(pending => { return { ...pending, replace: [...pending.replace, node] } })
    }

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
            {nodeToModify.oldId &&
                <ContainerInput bottom hCenter>
                    <input
                        value={nodeToModify.newId}
                        style={{ color: 'white', background: 'none' }}
                        onChange={handleNameInput}
                    />

                    <Icon
                        tooltip="Save changes"
                        component={FaSave}
                        onClick={_ => updateName(nodeToModify)}
                        style={{ marginLeft: 10, display: nodeToModify.oldId === nodeToModify.newId ? 'none' : 'flex' }}
                    />
                </ContainerInput>}

            <ContainerInput bottom left>
                <ContainerColumn>
                    <Icon
                        style={{ marginBottom: 10 }}
                        tooltip="Re-create graph"
                        component={IoIosRefreshCircle}
                        onClick={() => updateNodes()}
                    />

                    <AddElement setPendingChanges={setPendingChanges} />
                </ContainerColumn>
            </ContainerInput>
        </Suspense>
    )
}
