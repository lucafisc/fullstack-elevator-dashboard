import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "./assets/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-a0oir8yzhmnp7jh3.us.auth0.com"
      clientId="nta4xjvoEqPLADRMPAODPjV3khN20F6C"
      useRefreshTokens={true}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "this is a unique identifier",
        scope: "openid profile email",
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>,
);
