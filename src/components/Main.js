import { useRef, useCallback, useEffect, useState } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import { FiCheck } from 'react-icons/fi';


export default function Main({ service }) {

    const [data, setData] = useState()

    // I need to keep the original node to find and reeplace after save
    const [selectedNode, setSelectedNode] = useState()
    const [modifiedNode, setModifiedNode] = useState()

    const [showCheck, setShowCheck] = useState(false)

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
        console.log('data', node.index, data.nodes)
        const nodes = data.nodes
        nodes[node.index] = node
        console.log('nodes', nodes)
        setData({ ...data, nodes: nodes })
    }

    useEffect((node, data) => {
        service.getData(setData)
    }, [service])

    return (
        <div>
            {data &&
                <ForceGraph3D
                    ref={fgRef}
                    graphData={data}
                    nodeLabel="id"
                    nodeAutoColorBy="group"
                    onNodeClick={handleClick}
                />}
            {selectedNode && <div style={{ position: 'fixed', bottom: 20, width: '100vw', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
                <input
                    value={selectedNode.id}
                    style={{ color: 'white', background: 'none' }}
                    onChange={handleNameInput}
                />
                {showCheck && <FiCheck style={{ color: 'cyan', fontSize: '1.4em', marginLeft: 10, fontWeight: 'bolder' }}
                    onClick={() => updateNodes(selectedNode, data)} />}
            </div>}
        </div>
    )
}
