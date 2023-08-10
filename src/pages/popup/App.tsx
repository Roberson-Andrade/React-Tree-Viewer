import React, { useCallback, useState } from 'react';
import './index.css';
import './reactflow.css';
import ReactFlow, {
  Edge,
  Node,
  useReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { useGetTree } from './hooks/useGetTree';
import { formatTree, getLayoutedElements } from './utils/tree';

const App = (): JSX.Element => {
  const [nodes, setNodes] = useState<Node<unknown, string | undefined>[]>([]);
  const [edges, setEdges] = useState<Edge<unknown>[]>([]);
  const { fitView } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  function updateComponents(request: { tree?: any }) {
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
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls />
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
};

export default App;
