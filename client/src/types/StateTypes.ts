import z from "zod";

export const OperationalState = "operational";
export const OutOfOrderState = "out-of-order";
export const WarningState = "warning";

export const elevatorStateCountSchema = z.object({
  [OperationalState]: z.number(),
  [OutOfOrderState]: z.number(),
  [WarningState]: z.number(),
});

export type ElevatorStateCount = z.infer<typeof elevatorStateCountSchema>;
