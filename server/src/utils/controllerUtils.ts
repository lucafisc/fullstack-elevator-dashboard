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

export async function registerVisit(req: Request, elevatorId: string) {
  // Register visit
  const visitedAt = new Date();
  const UserModel = await User.findOne({ "userInfo.auth0Id": req.auth.sub });
  const existingIndex = UserModel.recentlyViewed.findIndex(
    (entry) => entry.elevator.toString() === elevatorId
  );
  if (existingIndex !== -1) {
    // Existing elevator, update visitedAt and push to end
    const existingEntry = UserModel.recentlyViewed.splice(existingIndex, 1)[0];
    existingEntry.visitedAt = visitedAt;
    UserModel.recentlyViewed.push(existingEntry);
  } else {
    // New elevator, push to end
    UserModel.recentlyViewed.push({
      elevator: elevatorId,
      visitedAt: visitedAt,
    });
  }
  // Keep only the last 10
  const maxLength = 10;
  if (UserModel.recentlyViewed.length > maxLength) {
    const excess = UserModel.recentlyViewed.length - maxLength;
    UserModel.recentlyViewed.splice(0, excess);
  }

  // Register visit
  await UserModel.save();


}
