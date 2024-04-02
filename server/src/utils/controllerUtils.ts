import { Request } from "express";
import { getOrSetCache } from "./cacheUtils";
import { User } from "../db/user";
import { Elevator, ElevatorInterface } from "../db/elevator";

export function extractUserFromReq(req: Request) {
  return req.user as typeof User & { elevators: string[] } & {
    recentlyViewed: [{ elevator: string; visitedAt: Date }];
  };
}

export async function getUserElevators(req: Request) {
  const elevatorsCachedOrNot = (await getOrSetCache(
    `elevators:${req.auth.sub}`,
    async () => {
      const user = extractUserFromReq(req);
      const userElevatorsIds = user.elevators;
      const elevators = (await Elevator.find({
        _id: { $in: userElevatorsIds },
      }).select("-__v -chart")) as ElevatorInterface[];
      return elevators;
    }
  )) as ElevatorInterface[];

  return elevatorsCachedOrNot;
}
