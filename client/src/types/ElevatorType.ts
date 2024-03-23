import z from "zod";
import { OperationalState, OutOfOrderState, WarningState } from "./StateTypes";

const ElevatorType = z.enum(["Passenger", "Freight"]);

export const elevatorSchema = z.object({
  _id: z.string(),
  specifications: z.object({
    fabricationNumber: z.string(),
    address: z.string(),
    deviceIdentificationNumber: z.string(),
    manufacturerName: z.string(),
    productionYear: z.number(),
    elevatorType: ElevatorType,
  }),
  operationalState: z
    .object({
      floorNumber: z.number(),
      state: z.enum([OperationalState, OutOfOrderState, WarningState]),
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
});

export type Elevator = z.infer<typeof elevatorSchema>;
