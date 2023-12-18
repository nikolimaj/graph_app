import React, { useState, useEffect, useMemo, createContext, useContext, useReducer } from 'react';
import { useExpand } from './store/store';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, Handle, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from "./NodeTypes";
import FloatingEdge from './EdgeType';
import FloatingConnectionLine from './FloatingConnectionLine';
import { SidebarFilterList } from './SidebarFilterList';

export const NodesContext = React.createContext(null)

const edgeTypes = {
  floating: FloatingEdge,
};

// Props for the GeneGraph component
type GeneGraphProps = {
  geneID: string[]; // changed to array
  setIds;
};

// GeneGraph component
export function GeneGraph(props: GeneGraphProps) {
  let geneIds = props.geneID;
  let currentNodes = [];

  // state for the nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);


  // get all genes that are connected to the first node
  let { data: graph } = useExpand({
      geneIds: geneIds,
    limit: 1000,
  });

  useMemo(() => {
    (document as any).startViewTransition(() => {
      currentNodes = graph?.nodes.map((node,index)=>{
        return{
          id:node.id,
          position:{
            x:(node.position.x+1)*(window.innerWidth/2),
            y:(node.position.y+1)*(window.innerHeight/2)
          },
          data:{
            label:node.symbol == "nan" ? node.id : node.symbol,
            displayProps:{
              fullname:node.name,
              synonyms:node.synonyms,
              entrezId:node.entrezId,
              label:node.symbol == "nan" ? node.id : node.symbol,
              summary:node.summary,
            },
            children: node.children,
            parents: node.parents,
            isRoot: props.geneID.includes(node.id) ? true : false,
            type:node.type,
            onExpand: exp,
            onCollapse: coll
          },
          type: "node"
        }});
      setNodes(currentNodes)
      
      setEdges(
        graph?.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: 'floating',
        }))
      );

    })
  }, [graph]);

  function exp(id: string){
    if(!geneIds.includes(id)){
      geneIds = ([...geneIds,id])
      props.setIds(geneIds)
    }
  }

  function coll(id: string, children: [string]){
    geneIds = geneIds.filter(geneId => geneId != id)
    currentNodes.forEach((child) => {
      child.data.parents = child.data.parents.filter((parent: string) => parent != id)})
      
    var removeChildren = currentNodes.filter(node => children.includes(node.id))
    removeChildren = removeChildren.filter(node => node.data?.parents.length == 0)
    currentNodes = currentNodes.filter(node => !removeChildren.includes(node))
    setNodes(currentNodes)
  }

  return (
    <>
      <div style={{ height: '90%', width: '100%', display: 'flex' }}>

        <ReactFlowProvider>
          <div style={{ height: '100%', width: '77%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              connectionLineComponent={FloatingConnectionLine}
              fitView 
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
          <NodesContext.Provider value={{nodes: nodes, setNodes: setNodes}}>
            <SidebarFilterList />
          </NodesContext.Provider>
          
        </ReactFlowProvider>

      </div>

    </>

  );
}