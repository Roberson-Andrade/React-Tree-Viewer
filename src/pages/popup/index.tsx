import React from 'react';
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import App from './App';
import { ReactFlowProvider } from 'reactflow';

const root = document.querySelector('#root');

render(
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>,
  root,
);
