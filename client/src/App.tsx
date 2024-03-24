import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { Home } from "./components/NoUserHome";

function App() {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  return (
    <>
      {isAuthenticated && user && (
        <Dashboard
          user={user}
          logout={logout}
          getToken={getAccessTokenSilently}
        />
      )}
      {!isAuthenticated && <Home login={loginWithRedirect} />}
    </>
  );
}

export default App;