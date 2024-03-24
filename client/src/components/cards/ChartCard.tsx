import { LineChart } from "@mui/x-charts/LineChart";
import { Elevator } from "../../types/ElevatorType";
import { formatChartName } from "../../utils/formatChartName";
import { useParentDimensions } from "../../hooks/useParentDimensions";
type Props = {
  elevator: Elevator;
};

export default function ChartCard({ elevator }: Props) {
  const parentDimensions = useParentDimensions("parent-container", elevator);

  return (
    <>
      {elevator.chart && elevator.chart.data.length > 0 ? (
        <div className="w-full bg-primary border border-outline rounded-3xl mt-6 h-[500px] flex flex-col items-center justify-center sm:p-12 p-2">
          <h1 className="pt-8">{formatChartName(elevator.chart.name)}</h1>
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
      ) : (
        <div className="w-full bg-primary border border-outline rounded-3xl mt-6  flex flex-col items-center justify-center p-12">
          <h1>No charts available for this elevator</h1>
        </div>
      )}
    </>
  );
}
