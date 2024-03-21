import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any
      auth?: Record<string,any>
    }
  }
}