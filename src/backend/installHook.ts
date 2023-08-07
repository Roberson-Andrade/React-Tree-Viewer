import circular from 'circular';

let hasRun = false;
let nodeId = 1;

const generateTree = (node, parentArr) => {
  if (!node || !node.type || !node.type.name || typeof node.type.name !== 'string') {
    // Skip nodes without a name or with a non-string name
    if (node.child) generateTree(node.child, parentArr);
    if (node.sibling) generateTree(node.sibling, parentArr);
    return;
  }

  const newComponent = {
    name: node.type.name,
    children: [],
    state: node.memoizedState || null,
    id: nodeId,
  };

  nodeId++;

  newComponent.children = [];
  parentArr.push(newComponent);

  if (node.child) generateTree(node.child, newComponent.children);
  if (node.sibling) generateTree(node.sibling, parentArr);
};

const traverseFiberDOM = (fiberDOM) => {
  if (typeof fiberDOM === 'undefined') return;

  let components = [];
  generateTree(fiberDOM.current.stateNode.current, components);
  console.log('components: ', components);

  components = JSON.parse(JSON.stringify(components, circular()));
  window.postMessage({ type: 'react-tree-viewer-generate-tree', tree: components })
};

let timeoutId: NodeJS.Timeout;


(() => {
  if (!hasRun) {
    if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('React devtools not found');
      return;
    }

    const reactInstances = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers || null;
    const instance = reactInstances.get(1);
    const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    let fiberDOM;

    if (instance) {
      const enableReactTreeViewer = (onCommitFiberRoot) => {
        return (...args) => {
          clearTimeout(timeoutId);
          
          timeoutId = setTimeout(() => {
            fiberDOM = args[1];
          traverseFiberDOM(fiberDOM);
          }, 300);
          return onCommitFiberRoot(...args);
        };
      };

      devTools.onCommitFiberRoot = enableReactTreeViewer(devTools.onCommitFiberRoot);

      traverseFiberDOM(fiberDOM);
    }

    hasRun = true;
  }
})()