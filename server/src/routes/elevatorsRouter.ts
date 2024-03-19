import express from 'express';
export const elevatorsRouter = express.Router();
import { getElevators, getElevatorById, getElevatorsByState, getElevatorsCountByState, getRecentlyVisitedElevators } from '../controllers/elevatorController';

// GET /elevators
elevatorsRouter.get('/elevators', getElevators)

// GET /elevators/state/count
elevatorsRouter.get('/elevators/state/count', getElevatorsCountByState)

// GET /elevators/recentlyVisited
elevatorsRouter.get('/elevators/recentlyVisited', getRecentlyVisitedElevators);

// GET /elevators/state/:state
elevatorsRouter.get('/elevators/state/:state', getElevatorsByState);

// GET /elevators/:id
elevatorsRouter.get('/elevators/:id', getElevatorById);