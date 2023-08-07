let LAST_TREE_GENERATED: any;

function injectScript(file: string, node: string) {
  const th = document.getElementsByTagName(node)[0];
  const s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}


injectScript(chrome.runtime.getURL('backend/installHook.js'), 'body');

chrome.runtime.onMessage.addListener(async (message) => {
  if(message.type === 'react-tree-viewer-retrieve-tree'){
    chrome.runtime.sendMessage({ tree: LAST_TREE_GENERATED });
  }
})

window.addEventListener("message", function (event) {
  // only accept messages from the current tab
  console.log(event.data.type);
  if (event.source != window){
    return;
  }


  switch (event.data.type) {
    case "react-tree-viewer-generate-tree":
      LAST_TREE_GENERATED = event.data.tree;
      chrome.runtime.sendMessage({ tree: event.data.tree });
      break;
  
    default:
      break;
  }
}, false);