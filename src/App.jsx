import React from 'react';
import { App as AntdApp } from 'antd';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AntdApp>
      <div className="App">
        <AppRoutes />
      </div>
    </AntdApp>
  );
}

export default App;