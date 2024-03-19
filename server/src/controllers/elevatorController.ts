import { Elevator, stateEnum } from "../db/elevator";
import type { StateEnum } from "../db/elevator";
import { Chart } from "../db/chart";
import { RecentlyVisitedElevator } from "../db/recentlyViewed";
import asyncHandler from "express-async-handler";

export const getElevators = asyncHandler(async (req, res) => {
  const elevators = await Elevator.find();
  res.json(elevators);
});

export const getRecentlyVisitedElevators = asyncHandler(async (req, res) => {
  const recentlyVisitedElevators = await RecentlyVisitedElevator.find()
    .populate("elevator");
  res.json(recentlyVisitedElevators);
})

export const getElevatorById = asyncHandler(async (req, res) => {
  const elevator = await Elevator.findById(req.params.id).populate("chart");

  if (!elevator) {
    throw new Error("Elevator not found");
  }

  const recentlyVisitedElevator = new RecentlyVisitedElevator({
    elevator: req.params.id,
    visitedAt: new Date(),
  });
  await recentlyVisitedElevator.save();

  console.log(elevator);
  res.json(elevator);
});

export const getElevatorsByState = asyncHandler(async (req, res) => {
  const state = req.params.state as StateEnum;
  if (!Object.values(stateEnum).includes(state)) {
    throw new Error("Invalid state");
  }
  const elevators = await Elevator.find({ state: state });
  res.json(elevators);
});

export const getElevatorsCountByState = asyncHandler(async (req, res) => {
  const countByState: Record<StateEnum, number> = {
    operational: 0,
    "out-of-order": 0,
    warning: 0,
  };

  const countPromises = (state: string) => {
    return Elevator.countDocuments({ state });
  };

  const functionMap = Object.values(stateEnum).map((state) =>
    countPromises(state)
  );
  const counts = await Promise.all(functionMap);

  Object.values(stateEnum).forEach((state, index) => {
    countByState[state] = counts[index];
  });

  res.json(countByState);
});
