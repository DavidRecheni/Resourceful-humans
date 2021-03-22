import { useRef, useCallback, useEffect, useState, Suspense } from 'react'
import Modal from 'react-modal';

// libs
import ForceGraph3D from 'react-force-graph-3d'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

// components
import { ContainerInput } from './styled/ContainerInput'

// icons
import { FiCheck } from 'react-icons/fi';
import { IoAddCircle } from 'react-icons/io5'

export default function Main({ service }) {

    const [data, setData] = useState()

    // Store the original node to search and reeplace after changes
    const [selectedNode, setSelectedNode] = useState()
    const [modifiedNode, setModifiedNode] = useState()

    // if was modified
    const [showCheck, setShowCheck] = useState(false)

    // Aux
    const [addHover, setAddHover] = useState(false)
    const [addHoverStyles, setAddHoverStyles] = useState({})
    const [addModal, setAddModal] = useState(false)
    const fgRef = useRef()

    const handleNameInput = name => {
        setModifiedNode({ ...modifiedNode, id: name.target.value })
        setShowCheck(true)
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
        setShowCheck(false)
    }, [fgRef])

    const updateNodes = (node, data) => {
        const nodes = data.nodes
        nodes[node.index] = node
        setData({ ...data, nodes: nodes })
    }

    useEffect(() => {
        service.getData(setData)
    }, [service])

    // Bloom effect
    useEffect(() => {
        const bloomPass = new UnrealBloomPass();
        bloomPass.strength = 1;
        bloomPass.radius = 1;
        bloomPass.threshold = 0.1;
        fgRef.current.postProcessingComposer().addPass(bloomPass);
    }, []);


    useEffect(() => {

        setAddHoverStyles(addHover ? {
            color: 'cyan'
        } :
            {})
    }, [addHover])

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
                        value={selectedNode.id}
                        style={{ color: 'white', background: 'none' }}
                        onChange={handleNameInput}
                    />
                    {showCheck &&
                        <FiCheck
                            style={{ color: 'cyan', fontSize: '1.4em', marginLeft: 10, fontWeight: 'bolder' }}
                            onClick={() => updateNodes(selectedNode, data)} />}
                </ContainerInput>}

            <ContainerInput bottom right>
                < IoAddCircle
                    onMouseEnter={_ => setAddHover(true)}
                    onMouseLeave={_ => setAddHover(false)}
                    style={{ color: 'white', fontSize: '2em', ...addHoverStyles }}
                    onClick={_ => setAddModal(true)}
                />
            </ContainerInput>


            {/* Add element modal */}
            <Modal
                isOpen={addModal}
                // onAfterOpen={afterOpenModal}
                onRequestClose={_ => setAddModal(false)}
                contentLabel="Add element modal"
            >
                <h2>Add element</h2>
            </Modal>
        </Suspense>
    )
}
