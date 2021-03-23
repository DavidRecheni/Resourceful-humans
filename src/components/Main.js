import { useRef, useCallback, useEffect, useState, Suspense } from 'react'
import Modal from 'react-modal';

// libs
import ForceGraph3D from 'react-force-graph-3d'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

// components
import { ContainerInput } from './styled/ContainerInput'
import { ContainerColumn } from './styled/ContainerColumn'
import Icon from './styled/Icon'

// icons
import { FaSave } from 'react-icons/fa'
import { IoAddCircle } from 'react-icons/io5'
import { IoIosRefreshCircle } from 'react-icons/io'

export default function Main({ service }) {

    const [data, setData] = useState()

    // Store the original node to search and reeplace after changes
    const [selectedNode, setSelectedNode] = useState()
    const [modifiedNode, setModifiedNode] = useState()

    // Aux
    const [showAdd, setShowAdd] = useState(false)

    const fgRef = useRef()

    const handleNameInput = name => {
        setModifiedNode({ ...modifiedNode, id: name.target.value })
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

        setSelectedNode(node)
        setModifiedNode(node)
    }, [fgRef])

    const updateNodes = (node, data) => {
        const nodes = data.nodes
        nodes[node.index] = node
        setData({ ...data, nodes: nodes })
    }

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
            {selectedNode &&
                <ContainerInput bottom hCenter>
                    <input
                        value={modifiedNode?.id}
                        style={{ color: 'white', background: 'none' }}
                        onChange={handleNameInput}
                    />

                    <Icon component={FaSave} />
                </ContainerInput>}

            <ContainerInput bottom right>
                <ContainerColumn>
                    <Icon component={IoIosRefreshCircle}
                        onClick={() => updateNodes(selectedNode, data)}
                    />

                    < Icon component={IoAddCircle}
                        onClick={_ => setShowAdd(true)}
                    />
                </ContainerColumn>
            </ContainerInput>

            {/* Add element modal */}
            <Modal
                isOpen={showAdd}
                onRequestClose={_ => setShowAdd(false)}
                contentLabel="Add element modal"
            >
                <h2>Add element</h2>
            </Modal>
        </Suspense>
    )
}
