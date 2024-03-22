import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import axios from "axios";
import { useState } from "react";

// Find out if it is better to save the token in the local storage or in the state
function App() {
  const [elevators, setElevators] = useState([]);

  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  async function getElevatorsCountByState() {
    try {
      const token = await getAccessTokenSilently();

      const response = await axios.get(
        "http://localhost:3000/elevators/state/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const countByState = response.data;
      console.log("Elevators count by state:", countByState);
      console.log("Elevators count by state:", countByState);
    } catch (error) {
      console.error("Error fetching elevators count by state:", error);
      throw error;
    }
  }
  // 65fc1e5c4471970a83f38895
  async function getElevatorById() {
    const id = '65fc1e5c4471970a83f38895';
    try {
      const token = await getAccessTokenSilently();

      const response = await axios.get(`http://localhost:3000/elevators/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Elevator by id:", response.data);

  } catch (error) {
    console.error("Error fetching elevator by id:", error);
    throw error;
  }
}

  async function getElevatorsByState() {
    try {
      const token = await getAccessTokenSilently();

      const response = await axios.get(
        "http://localhost:3000/elevators/state/warning",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const elevators = response.data;
      console.log("Elevators that are operational:", elevators);
    } catch (error) {
      console.error("Error fetching elevators by state:", error);
      throw error;
    }
  }

  async function getElevators() {
    try {
      const token = await getAccessTokenSilently();

      const response = await axios.get("http://localhost:3000/elevators", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const elevators = response.data;
      console.log("Elevators:", elevators);
      setElevators(elevators);
    } catch (error) {
      console.error("Error fetching elevators:", error);
      throw error;
    }
  }
  // /elevators/recentlyVisited
  // GET /elevators/recentlyVisited
  async function getRecentlyVisitedElevators() {
    try {
      const token = await getAccessTokenSilently();

      const response = await axios.get(
        "http://localhost:3000/elevators/recentlyVisited",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const recentlyVisitedElevators = response.data;
      console.log("Recently visited elevators:", recentlyVisitedElevators);
    } catch (error) {
      console.error("Error fetching recently visited elevators:", error);
      throw error;
    }
  }

  return (
    <>
    <button onClick={getRecentlyVisitedElevators}>Get Recently Visited Elevators</button>
    <button onClick={getElevatorById}>Get Elevator by id</button>
    <button onClick={getElevatorsByState}>Get Elevators by state</button>
    <button onClick={getElevators}>Get Elevators</button>
    <button onClick={getElevatorsCountByState}>Get Elevators Count By State</button>
      <button onClick={() => loginWithRedirect()}>Log In</button>
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
     {elevators && (<div>
        <h3>Elevator Count: {elevators.length}</h3>
      </div>)}
    </>
  );
}

export default App;
