import { useAuth0 } from "@auth0/auth0-react";
import "./assets/App.css";
import Home from "./components/pages/Home";
import { Welcome } from "./components/pages/Welcome";

function App() {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  return (
    <>
      {isAuthenticated && user ? (
        <Home
          user={user}
          logout={logout}
        />
      ) : (
        <Welcome login={loginWithRedirect} />
      )}
    </>
  );
}

export default App;
