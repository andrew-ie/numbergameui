import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    <div>
        <code>
            Source code is available on <a href="https://github.com/andrew-ie/numbergameui">GitHub</a>
        </code>
    </div>
  </React.StrictMode>
);
