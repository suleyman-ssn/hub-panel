import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={ruRU} theme={{ token: { colorPrimary: '#1677ff', borderRadius: 8 } }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
