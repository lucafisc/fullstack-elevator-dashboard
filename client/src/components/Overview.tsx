import { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { getFromAPI } from "../functions/getFromAPI";
import type { ElevatorStateCount } from "../types/StateTypes";
import { elevatorStateCountSchema } from "../types/StateTypes";
import StateCard from "./StateCard";
import GridContainer from "./GridContainer";
import { RecentlyVisited, recentlyVisitedSchema } from "../types/ElevatorType";
import ElevatorCard from "./ElevatorCard";
type Props = {
  getToken: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>;
};


export default function Overview({ getToken }: Props) {
  const [elevatorStateCount, setElevatorStateCount] =
    useState<ElevatorStateCount | null>(null);
    const [elevators, setElevators] = useState<RecentlyVisited[]>([]);


  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const response = (await getFromAPI({
          endpoint: "/elevators/state/count",
          getToken,
        })) as ElevatorStateCount;
        const data = elevatorStateCountSchema.parse(response);
        setElevatorStateCount(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setElevatorStateCount(null);
      }
    };
    const fetchRecentData = async () => {
      try {
        const response = (await getFromAPI({
          endpoint: '/elevators/recentlyVisited',
          getToken: getToken,
        })) as RecentlyVisited[];
        const data = response.map((elevator) => recentlyVisitedSchema.parse(elevator));
        data.reverse();
        setElevators(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRecentData();
    fetchStateData();
  }, [getToken]);

  return (
    <>
      <h1 className="py-5 text-xl">State Overview</h1>
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
        {elevatorStateCount &&
          Object.entries(elevatorStateCount).map(([state, count]) => (
            <StateCard key={state} state={state} count={count} />
          ))}
      </div>
      <h1 className="py-5 text-xl">Recently viewed elevators</h1>

      <GridContainer>
        {elevators.map((obj) => (
          <ElevatorCard key={obj.elevator._id} elevator={obj.elevator} />
        ))}
      </GridContainer>
    </>
  );
}
