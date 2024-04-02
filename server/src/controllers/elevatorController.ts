import { User } from "../db/user";
import { Elevator, stateEnum, ElevatorInterface } from "../db/elevator";
import type { StateEnum } from "../db/elevator";
import asyncHandler from "express-async-handler";
import { clearCache, getOrSetCache } from "../utils/cacheUtils";
import {
  extractUserFromReq,
  getUserElevators,
  registerVisit,
} from "../utils/controllerUtils";

// GET all elevators
export const getElevators = asyncHandler(async (req, res) => {
  const elevators = await getUserElevators(req);
  res.json(elevators);
});

// GET elevators count by state
export const getElevatorsCountByState = asyncHandler(async (req, res) => {
  const count = (await getOrSetCache(
    `elevatorsCountByState:${req.auth.sub}`,
    async () => {
      const elevators = await getUserElevators(req);
      const countByState: Record<StateEnum, number> = {
        operational: 0,
        "out-of-order": 0,
        warning: 0,
      };
      elevators.forEach((elevator) => {
        const operationalState = elevator.operationalState.state;
        countByState[operationalState]++;
      });
      return countByState;
    }
  )) as Record<string, number>;
  res.json(count);
});

// GET recently visited elevators
export const getRecentlyVisitedElevators = asyncHandler(async (req, res) => {
  const recent = await getOrSetCache(`recently:${req.auth.sub}`, async () => {
    const user = extractUserFromReq(req);
    const recentElevators = user.recentlyViewed.map((entry) => ({
      elevator: entry.elevator.toString(),
      visitedAt: entry.visitedAt,
    }));

    // Populate elevators
    const populatedElevators = await Promise.all(
      recentElevators.map(async (entry) => {
        const elevator = await Elevator.findById(entry.elevator)
          .select("-__v -chart")
          .exec();
        return {
          elevator,
          visitedAt: entry.visitedAt,
        };
      })
    );
    return populatedElevators;
  });

  res.json(recent);
});

// GET elevators by state
export const getElevatorsByState = asyncHandler(async (req, res) => {
  const state = req.params.state as StateEnum;
  if (!Object.values(stateEnum).includes(state)) {
    res.status(404);
    res.json({ message: "Not a valid state" });
    return;
  }

  const elevatorsByState = await getOrSetCache(
    `elevatorsBy:${state}:${req.auth.sub}`,
    async () => {
      const elevators = await getUserElevators(req);
      const filteredElevators = elevators.filter(
        (elevator) => elevator.operationalState.state === state
      );
      return filteredElevators;
    }
  );

  res.json(elevatorsByState);
});

// GET elevator by id
export const getElevatorById = asyncHandler(async (req, res, next) => {
  const elevatorId = req.params.id;
  const user = extractUserFromReq(req);
  const belongsToUser = user.elevators.includes(elevatorId);
  if (!belongsToUser) {
    res.status(403);
    res.json({ message: "Elevator does not belong to user" });
    return;
  }
  
  const elevatorDetail = await getOrSetCache(`elevator:${elevatorId}`, async () => {
    // Get elevator and populate chart
    const elevator = await Elevator.findById(elevatorId)
    .populate({ path: "chart", select: "-__v" })
    .select("-__v");
    if (!elevator) {
      res.status(404);
      res.json({ message: "Elevator not found" });
      return;
    }
    return elevator;
  });
    
  await registerVisit(req, elevatorId);
  clearCache(`recently:${req.auth.sub}`);

  res.json(elevatorDetail);
});
