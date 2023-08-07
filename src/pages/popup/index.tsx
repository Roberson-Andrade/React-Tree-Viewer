import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { ReactFlowProvider } from 'reactflow'

console.log('popup script')

const root = document.querySelector('#root')

render(
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>,
  root,
)
