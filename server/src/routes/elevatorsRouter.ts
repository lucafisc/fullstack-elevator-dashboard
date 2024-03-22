import express from "express";
export const elevatorsRouter = express.Router();
import {
  getElevators,
  getElevatorById,
  getElevatorsByState,
  getElevatorsCountByState,
  getRecentlyVisitedElevators,
} from "../controllers/elevatorController";
// API versioning
// DTO
// GET /
elevatorsRouter.get("/", getElevators);

// GET /state/count
elevatorsRouter.get("/state/count", getElevatorsCountByState);

// GET /recentlyVisited
elevatorsRouter.get("/recentlyVisited", getRecentlyVisitedElevators);

// GET /state/:state
elevatorsRouter.get("/state/:state", getElevatorsByState);

// GET /:id
elevatorsRouter.get("/:id", getElevatorById);
