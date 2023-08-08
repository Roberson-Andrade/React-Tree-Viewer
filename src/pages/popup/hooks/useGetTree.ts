import { useEffect } from "react"

interface UseGetTreeProperties {
  updateComponents: (request: { tree?: any }) => void
}

export function useGetTree({ updateComponents}: UseGetTreeProperties): void {
  useEffect(() => {
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
}