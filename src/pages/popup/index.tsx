import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { ReactFlowProvider } from 'reactflow'

const root = document.querySelector('#root')

render(
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>,
  root,
)
