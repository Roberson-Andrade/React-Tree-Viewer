export type WorkTag =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

/**
 * @type Fiber - The internal data structure that represents a `fiberNode` or a component in the React component tree
 *
 * {@link https://indepth.dev/posts/1008/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react}
 * @member actualDuration - The time taken to render the current Fiber node and its descendants during the previous render cycle. This value is used to optimize the rendering of components and to provide performance metrics to developers.
 * @member actualStartTime - The time at which the rendering of the current Fiber node started during the previous render cycle.
 * @member child - Pointer to the first child.
 * @member elementType  - The type of the current Fiber node's element (e.g. the component function or class, or the DOM element type). For class/functional component, elmementType stores the function definition.
 * @member key - The key a user assigned to the component or null if they didn't assign one
 * @member memoizedProps - The current props of the component associated with the current Fiber node.
 * @member memoizedState - The current state of the component associated with the current Fiber node.
 * @member selfBaseDuration - The base duration of the current Fiber node's render phase (excluding the time taken to render its children). This field is only set when the enableProfilerTimer flag is enabled.
 * @member sibling - Pointer to next sibling
 * @member stateNode - The local state associated with this fiber. For classComponent, stateNode contains current state and the bound update methods of the component
 * @member tag - The type of the current Fiber node, such as FunctionComponent, ClassComponent, or HostComponent (for DOM elements).
 * @member treeBaseDuration - The total base duration of the current Fiber node's subtree. This field is only set when the enableProfilerTimer flag is enabled.
 * @member _debugHookTypes - An array of hooks used for debugging purposes.
 */
export type Fiber = {
  /**
   * Time spent rendering this Fiber and its descendants for the current update.
   *
   * This tells us how well the tree makes use of sCU for memoization. It is reset to 0 each time we render and only updated when we don't bailout.
   *
   * This field is only set when the enableProfilerTimer flag is enabled.
   */
  actualDuration?: number;

  /**
   * If the Fiber is currently active in the "render" phase, this marks the time at which the work began.
   *
   * This field is only set when the enableProfilerTimer flag is enabled.
   */
  actualStartTime?: number;

  // Singly Linked List Tree Structure.
  /** Pointer to the first child. */
  child: Fiber | null;

  /**
   * The type of the current Fiber node's element (e.g. the component function or class, or the DOM element type).
   *
   * For class/functional component, elmementType stores the function definition.
   */
  elementType: any;

  /**
   * Unique key string assigned by the user when making component on null if they didn't assign one
   */
  key: string | null;

  /** The current state for a functional component associated with the current Fiber node. */
  memoizedState: any;

  /** The current props of the component associated with the current Fiber node. */
  memoizedProps: any;

  /**
   * Duration of the most recent render time for this Fiber. This value is not updated when we bailout for memoization purposes.
   *
   * This field is only set when the enableProfilerTimer flag is enabled.
   */
  selfBaseDuration?: number;

  // Singly Linked List Tree Structure.
  /**  Pointer to next sibling */
  sibling: Fiber | null;

  /**
   * The local state associated with this fiber.
   *
   * For classComponent, stateNode contains current state and the bound update methods of the component.
   */
  stateNode: any;

  /** The type of the current Fiber node, such as FunctionComponent, ClassComponent, or HostComponent (for DOM elements). */
  tag: WorkTag;

  /**
   * Sum of base times for all descendants of this Fiber. This value bubbles up during the "complete" phase.
   *
   * This field is only set when the enableProfilerTimer flag is enabled.
   */
  treeBaseDuration?: number;

  /** An array of hooks used for debugging purposes. */
  _debugHookTypes: string[] | null;

  type: {
    name: string;
  };
};

/**
 * @type FiberRoot - The internal data structure that represents a fiberRootNode or the top-level node of a single component tree
 *
 * FiberRoot data structure has several properties. For Reactime, we only access the `current` property which contains the tree structure made of `fiberNode`. Each `fiberNode` contains a component data in the React component tree.
 */
export type FiberRoot = {
  current: Fiber;
};

/**
 * @interface DevTools - A global object provided by the React Developer Tools extension. It provides a set of methods that allow developers to inspect and manipulate React components in the browser.
 */
export interface DevTools {
  /**
   * @property renderers - an Map object containing information about the React renders that are currently active on the page. The react version being used can be obtained at key = 1.
   */
  renderers: Map<1, undefined | { version: string }>;
  /**
   * @method getFiberRoots - get the Set of fiber roots that are currently mounted for the given rendererID. If not found, initalize a new empty Set at renderID key.
   * @param renderID -  a unique identifier for a specific instance of a React renderer. When a React application is first mounted, it will receive a rendererID. This rendererID will remain the same for the entire lifecycle of the application, even if the state is updated and the components are re-rendered/unmounted/added. However, if the application is unmounted and re-mounted again, it will receive a new rendererID.
   * @return A set of fiberRoot.
   */
  getFiberRoots: (rendererID: number) => Set<FiberRoot>;

  /**
   * @method onCommitFiberRoot - After the state of a component in a React Application is updated, the virtual DOM will be updated. When a render has been commited for a root, onCommitFiberRoot will be invoked to determine if the component is being mounted, updated, or unmounted. After that, this method will send update information to the React DevTools to update its UI to reflect the change.
   * @param rendererID -  a unique identifier for a specific instance of a React renderer
   * @param root - root of the rendered tree (a.k.a the root of the React Application)
   * @param priorityLevel
   * @return void
   */
  onCommitFiberRoot: (
    rendererID: number,
    root: FiberRoot,
    priorityLevel: any,
  ) => void;
}
