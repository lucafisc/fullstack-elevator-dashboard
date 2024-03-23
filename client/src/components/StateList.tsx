import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFromAPI } from "../functions/getFromAPI";
import { useAuth0 } from "@auth0/auth0-react";
import type { Elevator } from "../types/ElevatorType";
import { elevatorSchema } from "../types/ElevatorType";
import ElevatorCard from "./ElevatorCard";
import GridContainer from "./GridContainer";

export default function StateList() {
  const [elevators, setElevators] = useState<Elevator[]>([]);
  const { state } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = (await getFromAPI({
          endpoint: `/elevators/state/${state}`,
          getToken: getAccessTokenSilently,
        })) as Elevator[];
        const data = response.map((elevator) => elevatorSchema.parse(elevator));
        setElevators(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [state]);

  return (
    <>
      <div className="pb-10">
        <Link to="/">← Back to Dashboard</Link>
      </div>

      <GridContainer>
        {elevators.map((elevator) => (
          <ElevatorCard key={elevator._id} elevator={elevator} />
        ))}
      </GridContainer>
    </>
  );
}
