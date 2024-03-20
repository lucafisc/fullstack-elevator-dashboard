import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import axios from "axios";

function App() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  function callElevators() {
    axios.get("http://localhost:3000/elevators").then((response) => {
      const elevators = response.data;
      const parsedElevators = JSON.stringify(elevators, null, 2);
      console.log(parsedElevators);
    } ).catch((error) => {
      console.log(error);
    });
  }

  function callRoot() {
    axios.get("http://localhost:3000").then((response) => {
      console.log(response);
    } ).catch((error) => {
      console.log(error);
    });
  }

  return (
    <>
    <button onClick={callRoot}>Call /</button>
    <button onClick={callElevators}>Call /elevators</button>
      <button onClick={() => loginWithRedirect()}>Log In</button>;
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log Out
      </button>
      {isAuthenticated && user && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}
    </>
  );
}

export default App;
