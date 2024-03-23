import z from "zod";

export const elevatorStateCountSchema = z.object({
    "operational": z.number(),
    "out-of-order": z.number(),
    "warning": z.number(),
});

export type ElevatorStateCount = z.infer<typeof elevatorStateCountSchema>;