import express from "express";
import { User } from "../../db/user";

declare global {
  namespace Express {
    interface Request {
      user?: typeof User
      auth?: Record<string,any>
    }
  }
}