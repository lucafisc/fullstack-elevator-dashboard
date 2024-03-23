import { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { getFromAPI } from "../functions/getFromAPI";
import type { ElevatorStateCount } from "../types/StateTypes";
import { elevatorStateCountSchema } from "../types/StateTypes";
import StateCard from "./StateCard";
type Props = {
  getToken: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>;
};

export default function StateOverview({ getToken }: Props) {
  const [elevatorStateCount, setElevatorStateCount] =
    useState<ElevatorStateCount | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, [getToken]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
      {elevatorStateCount !== null ? (
        Object.entries(elevatorStateCount).map(([state, count]) => (
          <StateCard key={state} state={state} count={count} />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
