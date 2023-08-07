import React, { useEffect, useState } from 'react'
import './index.css'
import './reactflow.css'
import ReactFlow, { Edge, Node, useReactFlow } from 'reactflow'
import { stratify, tree } from 'd3-hierarchy'

interface Tree {
  children: Tree[]
  id: number
  name: string | { consumer: string } | null
  state: string
}

const g = tree<{ id: string }>()

const getLayoutedElements = (
  nodes: Node<unknown, string | undefined>[],
  edges: Edge<unknown>[],
): { nodes: Node<unknown, string | undefined>[]; edges: Edge<unknown>[] } => {
  if (nodes.length === 0) return { nodes, edges }

  const rect = document
    ?.querySelector(`[data-id="${nodes[0].id}"]`)
    ?.getBoundingClientRect()

  if (!rect) {
    return { nodes, edges }
  }

  const { width, height } = rect

  const hierarchy = stratify<{ id: string }>()
    .id((node) => node.id)
    .parentId((node) => edges.find((edge) => edge.target === node.id)?.source)
  const root = hierarchy(nodes)
  const layout = g.nodeSize([width * 2, height * 2])(root)

  return {
    nodes: layout.descendants().map((node) => ({
      ...node.data,
      position: { x: node.x, y: node.y },
    })) as Node<unknown, string | undefined>[],
    edges,
  }
}

function formatTree(
  treeNode: Tree,
  nodes: Node<unknown, string | undefined>[],
  edges: Edge<unknown>[],
) {
  console.log('treeNode.id', treeNode.id)

  const newNode: Node<unknown, string | undefined> = {
    id: String(treeNode.id),
    position: {
      x: 0,
      y: 0,
    },
    data: { label: treeNode.name ?? String(treeNode.id) },
  }

  nodes.push(newNode)

  if (treeNode.children.length > 0) {
    for (const child of treeNode.children) {
      edges.push({
        id: String(newNode.id) + '-' + String(child.id),
        source: newNode.id,
        target: String(child.id),
      })
      formatTree(child, nodes, edges)
    }
  }
}

const App = (): JSX.Element => {
  const [nodes, setNodes] = useState<Node<unknown, string | undefined>[]>([])
  const [edges, setEdges] = useState<Edge<unknown>[]>([])
  const { fitView } = useReactFlow()

  function updateComponents(request: { tree?: any }) {
    if (request.tree) {
      const [root] = request.tree
      const nodes: Node<unknown, string | undefined>[] = []
      const edges: Edge<unknown>[] = []
      formatTree(root, nodes, edges)

      setNodes(nodes)
      setEdges(edges)

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges)

      setNodes([...layoutedNodes])
      setEdges([...layoutedEdges])

      window.requestAnimationFrame(() => {
        fitView()
      })
    }
  }

  useEffect(() => {
    console.log('oi')
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      const [currentTab] = tab

      if (currentTab.id) {
        chrome.tabs.sendMessage(currentTab.id, {
          type: 'react-tree-viewer-retrieve-tree',
        })
      }
    })
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(updateComponents)

    return () => {
      chrome.runtime.onMessage.removeListener(updateComponents)
    }
  }, [])

  return (
    <div id="app">
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  )
}

export default App
