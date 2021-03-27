import React, { useEffect, useRef, useCallback } from 'react'
// libs
import ForceGraph3D from 'react-force-graph-3d'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'


export default function Graph({ data, dispatchNTM }) {

    const fgRef = useRef()

    const handleClick = useCallback(node => {
        // Aim at node from outside it
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        fgRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({x, y, z})
            3000  // ms transition duration
        );
        dispatchNTM({ type: 'SET_NODE', payload: node.id })
    }, [fgRef, dispatchNTM])

    useEffect(() => {
        const bloomPass = new UnrealBloomPass();
        bloomPass.strength = 1;
        bloomPass.radius = 1;
        bloomPass.threshold = 0.1;
        fgRef.current.postProcessingComposer().addPass(bloomPass);
    }, []);

    return (
        <ForceGraph3D
            ref={fgRef}
            graphData={data}
            nodeLabel="id"
            nodeAutoColorBy="group"
            onNodeClick={handleClick}
        />
    )
}
