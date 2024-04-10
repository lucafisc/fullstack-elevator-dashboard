import z from "zod";
import { OperationalState, OutOfOrderState, WarningState } from "./StateTypes";
import { chartSchema } from "./ChartType";

const ElevatorTypeSchema = z.enum(["Passenger", "Freight"]);

export const StateSchema = z.enum([OperationalState, OutOfOrderState, WarningState]);

export const elevatorSchema = z.object({
  _id: z.string(),
  specifications: z.object({
    fabricationNumber: z.string(),
    address: z.string(),
    deviceIdentificationNumber: z.string(),
    manufacturerName: z.string(),
    productionYear: z.number(),
    elevatorType: ElevatorTypeSchema,
  }),
  operationalState: z
    .object({
      floorNumber: z.number(),
      state: StateSchema,
      warningMessage: z.string().optional(),
      reason: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.state === WarningState) {
          return data.warningMessage !== undefined;
        }
        if (data.state === OutOfOrderState) {
          return data.reason !== undefined;
        }
        return true;
      },
      {
        message:
          "warningMessage is required for WarningState, and reason is required for OutOfOrderState",
        path: ["operationalState"],
      },
    ),
  chart: chartSchema.optional(),
});

export const recentlyVisitedSchema = z.object({
  elevator: elevatorSchema,
  visitedAt: z.string(),
});

export type RecentlyVisited = z.infer<typeof recentlyVisitedSchema>;
export type Elevator = z.infer<typeof elevatorSchema>;
