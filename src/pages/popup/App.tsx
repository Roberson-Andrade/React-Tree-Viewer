import React, { useState } from 'react';
import './index.css';
import './reactflow.css';
import ReactFlow, { Edge, Node, useReactFlow } from 'reactflow';
import { useGetTree } from './hooks/useGetTree';
import { formatTree, getLayoutedElements } from './utils/tree';

const App = (): JSX.Element => {
  const [nodes, setNodes] = useState<Node<unknown, string | undefined>[]>([]);
  const [edges, setEdges] = useState<Edge<unknown>[]>([]);
  const { fitView } = useReactFlow();

  function updateComponents(request: { tree?: any }) {
    console.log('request', request);
    if (request.tree) {
      const [root] = request.tree;
      const nodes: Node<unknown, string | undefined>[] = [];
      const edges: Edge<unknown>[] = [];
      formatTree(root, nodes, edges);

      setNodes(nodes);
      setEdges(edges);

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    }
  }

  useGetTree({ updateComponents });

  return (
    <div id="app">
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
};

export default App;
