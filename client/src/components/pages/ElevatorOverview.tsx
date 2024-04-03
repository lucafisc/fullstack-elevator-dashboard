import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { getFromAPI } from "../../utils/getFromAPI";
import type { ElevatorStateCount } from "../../types/StateTypes";
import { elevatorStateCountSchema } from "../../types/StateTypes";
import StateCard from "../cards/StateCard";
import GridContainer from "../ui/GridContainer";
import {
  RecentlyVisited,
  recentlyVisitedSchema,
} from "../../types/ElevatorType";
import ElevatorCard from "../cards/ElevatorCard";

export default function ElevatorOverview() {
  const [elevatorStateCount, setElevatorStateCount] =
    useState<ElevatorStateCount | null>(null);
  const [elevators, setElevators] = useState<RecentlyVisited[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch state count data
        const stateResponse = (await getFromAPI({
          endpoint: "/elevators/state/count",
          getToken: getAccessTokenSilently,
        })) as ElevatorStateCount;
        const stateData = elevatorStateCountSchema.parse(stateResponse);
        setElevatorStateCount(stateData);

        // Fetch recently visited elevators data
        const recentResponse = (await getFromAPI({
          endpoint: "/elevators/recentlyVisited",
          getToken: getAccessTokenSilently,
        })) as RecentlyVisited[];
        const recentData = recentResponse.map((elevator) =>
          recentlyVisitedSchema.parse(elevator),
        );
        recentData.reverse();
        setElevators(recentData);
      } catch (error) {
        setError("Error fetching elevator data");
      }
    };

    fetchData();
  }, [getAccessTokenSilently]);

  return error ? (
    <h1 className="py-5 text-xl">{error}</h1>
  ) : (
    <>
      {/* State Overview */}
      <h1 className="py-5 text-xl">State Overview</h1>
      <div className="flex flex-col justify-between w-full gap-4 sm:flex-row">
        {elevatorStateCount &&
          Object.entries(elevatorStateCount).map(([state, count]) => (
            <StateCard key={state} state={state} count={count} />
          ))}
      </div>

      {/* Recently viewed elevators */}
      <h1 className="py-5 text-xl">Recently viewed elevators</h1>
      <GridContainer>
        {elevators.map((obj) => (
          <ElevatorCard key={obj.elevator._id} elevator={obj.elevator} />
        ))}
      </GridContainer>
    </>
  );
}
