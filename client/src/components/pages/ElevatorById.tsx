import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Elevator, elevatorSchema } from "../../types/ElevatorType";
import { useAuth0 } from "@auth0/auth0-react";
import { getFromAPI } from "../../utils/getFromAPI";
import ElevatorCard from "../cards/ElevatorCard";
import { LineChart } from "@mui/x-charts/LineChart";
import { useParentDimensions } from "../../hooks/useParentDimensions";

export default function ElevatorById() {
  const [elevator, setElevator] = useState<Elevator | null>(null);
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const parentDimensions = useParentDimensions("parent-container", elevator);
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
      }
    };
    fetchData();
  }, [id, getAccessTokenSilently]);

  function parseChartName(text : string) {
    const words = text.split("_");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1) + " ";
    }
    const transformedText = words.join("");
    return transformedText;
  }

  return (
    <>
     <Link to="/">← Back to Dashboard</Link>
      <h1 className="py-5 text-xl">Elevator Detail</h1>
      {elevator && <ElevatorCard elevator={elevator} />}
      {elevator && elevator.chart && elevator.chart.data.length > 0 ? (
        <div className="w-full bg-primary border border-outline rounded-3xl mt-6 h-[500px] flex flex-col items-center justify-center sm:p-12 p-2">
          <h1 className="pt-8">{parseChartName(elevator.chart.name)}</h1>
          <div id="parent-container" className="w-full">
            <LineChart
              xAxis={[
                {
                  scaleType: "time",
                  data: elevator.chart.data.map((data) => new Date(data.time)),
                },
              ]}
              series={[
                {
                  data: elevator.chart.data.map(
                    (data) => data.door_closed_count
                  ),
                  label: "Door Closed Count",
                },
                {
                  data: elevator.chart.data.map(
                    (data) => data.door_closings_count
                  ),
                  label: "Door Closings Count",
                },
                {
                  data: elevator.chart.data.map(
                    (data) => data.door_cycles_count
                  ),
                  label: "Door Cycles Count",
                },
                {
                  data: elevator.chart.data.map(
                    (data) => data.door_opened_count
                  ),
                  label: "Door Opened Count",
                },
                {
                  data: elevator.chart.data.map(
                    (data) => data.door_openings_count
                  ),
                  label: "Door Openings Count",
                },
              ]}
              width={parentDimensions.width}
              height={400}
              grid={{ vertical: true, horizontal: true }}
              slotProps={{ legend: { hidden: true } }}
            />
          </div>
        </div>
      ) : (<div className="w-full bg-primary border border-outline rounded-3xl mt-6  flex flex-col items-center justify-center p-12">
        <h1>No charts available for this elevator</h1>
      </div>)}
    </>
  );
}
