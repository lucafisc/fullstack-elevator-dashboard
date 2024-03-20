import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
    domain="dev-a0oir8yzhmnp7jh3.us.auth0.com"
    clientId="nta4xjvoEqPLADRMPAODPjV3khN20F6C"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    >

    <App />
    </Auth0Provider>
  </React.StrictMode>,
)
