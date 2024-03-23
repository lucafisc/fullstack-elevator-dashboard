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

// async function getElevatorsCountByState() {
//     try {
//       const token = await getAccessTokenSilently();

//       const response = await axios.get(
//         "http://localhost:3000/elevators/state/count",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const countByState = response.data;
//       console.log("Elevators count by state:", countByState);
//       console.log("Elevators count by state:", countByState);
//     } catch (error) {
//       console.error("Error fetching elevators count by state:", error);
//       throw error;
//     }
//   }
//   // 65fc1e5c4471970a83f38895
//   async function getElevatorById() {
//     const id = '65fc1e5c4471970a83f38895';
//     try {
//       const token = await getAccessTokenSilently();

//       const response = await axios.get(`http://localhost:3000/elevators/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("Elevator by id:", response.data);

//   } catch (error) {
//     console.error("Error fetching elevator by id:", error);
//     throw error;
//   }
// }

//   async function getElevatorsByState() {
//     try {
//       const token = await getAccessTokenSilently();

//       const response = await axios.get(
//         "http://localhost:3000/elevators/state/warning",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const elevators = response.data;
//       console.log("Elevators that are operational:", elevators);
//     } catch (error) {
//       console.error("Error fetching elevators by state:", error);
//       throw error;
//     }
//   }

//   async function getElevators() {
//     try {
//       const token = await getAccessTokenSilently();

//       const response = await axios.get("http://localhost:3000/elevators", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },

//       });

//       const elevators = response.data;
//       console.log("Elevators:", elevators);
//       setElevators(elevators);

//     } catch (error) {
//       console.error("Error fetching elevators:", error);
//       throw error;
//     }
//   }
//   // /elevators/recentlyVisited
//   // GET /elevators/recentlyVisited
//   async function getRecentlyVisitedElevators() {
//     try {
//       const token = await getAccessTokenSilently();

//       const response = await axios.get(
//         "http://localhost:3000/elevators/recentlyVisited",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const recentlyVisitedElevators = response.data;
//       console.log("Recently visited elevators:", recentlyVisitedElevators);
//     } catch (error) {
//       console.error("Error fetching recently visited elevators:", error);
//       throw error;
//     }
//   }

//   async function getTestElevators() {

//     const testResponse = await axios.get("http://localhost:3000/test");
//     console.log("Test Elevators:", testResponse.data);
