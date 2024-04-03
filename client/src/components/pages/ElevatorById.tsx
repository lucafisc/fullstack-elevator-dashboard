import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Elevator, elevatorSchema } from "../../types/ElevatorType";
import { useAuth0 } from "@auth0/auth0-react";
import { getFromAPI } from "../../utils/getFromAPI";
import ElevatorCard from "../cards/ElevatorCard";
import ChartCard from "../cards/ChartCard";
import { z } from "zod";

const idSchema = z.string();

export default function ElevatorById() {
  const [elevator, setElevator] = useState<Elevator | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const { id } = useParams();

  useEffect(() => {
    const validateId = idSchema.safeParse(id);
    if (!validateId.success) {
      setError("Invalid id");
      return;
    }
    const fetchData = async () => {
      try {
        const response = (await getFromAPI({
          endpoint: `/elevators/${id}`,
          getToken: getAccessTokenSilently,
        })) as Elevator;
        console.log("response", response);
        const data = elevatorSchema.parse(response);
        setElevator(data);
        setError(null);
      } catch (error) {
        setError("An error occurred while fetching data. The elevator may not exist.");
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
