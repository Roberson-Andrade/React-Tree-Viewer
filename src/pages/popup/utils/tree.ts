import { stratify, tree } from "d3-hierarchy";
import { Edge, Node } from "reactflow";
import { Tree } from "../../../@types";

const g = tree<{ id: string }>()

export const getLayoutedElements = (
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

export function formatTree(
  treeNode: Tree,
  nodes: Node<unknown, string | undefined>[],
  edges: Edge<unknown>[],
) {
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