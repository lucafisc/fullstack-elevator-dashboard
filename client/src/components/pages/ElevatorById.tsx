import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Elevator, elevatorSchema } from "../../types/ElevatorType";
import { useAuth0 } from "@auth0/auth0-react";
import { getFromAPI } from "../../utils/getFromAPI";
import ElevatorCard from "../cards/ElevatorCard";
import ChartCard from "../cards/ChartCard";

export default function ElevatorById() {
  const [elevator, setElevator] = useState<Elevator | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = (await getFromAPI({
          endpoint: `/elevators/${id}`,
          getToken: getAccessTokenSilently,
        })) as Elevator;
        const data = elevatorSchema.parse(response);
        setElevator(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Invalid ID or error occurred");
      }
    };
    fetchData();
  }, [id, getAccessTokenSilently]);

  return (
    <>
      <Link to="/">← Back to Dashboard</Link>
      {error ? (
        <h1 className="py-5 text-xl">{error}</h1>
      ) : (
        <>
          <h1 className="py-5 text-xl">Elevator Detail</h1>
          {elevator && <ElevatorCard elevator={elevator} />}
          {elevator && <ChartCard elevator={elevator} />}
        </>
      )}
    </>
  );
}
