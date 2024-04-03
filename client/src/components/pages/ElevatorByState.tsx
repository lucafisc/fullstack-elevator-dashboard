import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFromAPI } from "../../utils/getFromAPI";
import { useAuth0 } from "@auth0/auth0-react";
import type { Elevator } from "../../types/ElevatorType";
import { elevatorSchema, StateSchema } from "../../types/ElevatorType";
import ElevatorCard from "../cards/ElevatorCard";
import GridContainer from "../ui/GridContainer";

export default function ElevatorByState() {
  const [elevators, setElevators] = useState<Elevator[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const { state } = useParams();
    
    useEffect(() => {
    const validateState = StateSchema.safeParse(state);
    if (!validateState.success) {
      setError("Invalid state");
      return;
    }
    const fetchData = async () => {
      try {
        const response = (await getFromAPI({
          endpoint: `/elevators/state/${state}`,
          getToken: getAccessTokenSilently,
        })) as Elevator[];
        const data = response.map((elevator) => elevatorSchema.parse(elevator));
        setElevators(data);
        setError(null);
      } catch (error) {
        setError("An error occurred while fetching data.");
      }
    };
    fetchData();
  }, [state, getAccessTokenSilently]);

  return (
    <>
      <Link to="/">← Back to Dashboard</Link>
      {error ? (
        <h1 className="py-5 text-xl">{error}</h1>
      ) : (
        <>
          <h1 className="py-5 text-xl">{`List of elevators with state ${state}`}</h1>
          <GridContainer>
            {elevators.map((elevator) => (
              <ElevatorCard key={elevator._id} elevator={elevator} />
            ))}
          </GridContainer>
        </>
      )}
    </>
  );
}
