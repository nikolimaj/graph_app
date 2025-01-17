import React from 'react';
import { useCallback } from 'react';
import { useStore, getBezierPath, EdgeProps, getStraightPath, getSmoothStepPath } from 'reactflow';
import { getEdgeParams } from './edgeparams';



export function FloatingEdge({ id, source, target, markerEnd, style }: EdgeProps) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));
  
    if (!sourceNode || !targetNode) {
      return null;
    }
  
    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);
    
    // check for NaN values
    if (isNaN(sx) || isNaN(sy) || isNaN(tx) || isNaN(ty)) {
      // console.log(sourcePos, targetPos);
      return null;
    }
    const [edgePath] = getStraightPath({
      sourceX: sx,
      sourceY: sy,
    //   sourcePosition: sourcePos,
    //   targetPosition: targetPos,
      targetX: tx,
      targetY: ty,
    });
  
    return (
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
    );
  }
  
  export default FloatingEdge;
