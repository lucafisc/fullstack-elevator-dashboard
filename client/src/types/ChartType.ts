import z from "zod";

export const chartSchema = z.object({

    name: z.string(),
    data: z.array(z.object({
        time: z.string(),
        door_closed_count: z.number(),
        door_closings_count: z.number(),
        door_cycles_count: z.number(),
        door_opened_count: z.number(),
        door_openings_count: z.number(),
    })),
});

export type Chart = z.infer<typeof chartSchema>;