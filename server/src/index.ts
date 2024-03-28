import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
import { elevatorsRouter } from "./routes/elevatorsRouter";
import axios from "axios";
import { getUserInfo, getTestUserInfo } from "./controllers/userController";

// Load environment variables
dotenv.config();
const port = process.env.PORT || 3000;
const mongoDB = process.env.DB_URL;
const issuer = process.env.ISSUER_BASE_URL;
const app: Express = express();

// Connect to MongoDB
mongoose.set("strictPopulate", false);
mongoose.Promise = Promise;
mongoose.connect(mongoDB);
mongoose.connection.on("error", (error: Error) => console.error(error));

// JWT middleware configuration
const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuer}.well-known/jwks.json`,
  }),
  audience: "this is a unique identifier",
  issuer: issuer,
  algorithms: ["RS256"],
}).unless({ path: ["/"] });

// Middleware
app.use(cors());
app.use("/elevators", jwtCheck);
app.use("/elevators", getUserInfo);
app.use("/test", getTestUserInfo);
app.use(express.json());

// Routes
app.use("/elevators", elevatorsRouter);
app.use("/test", elevatorsRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof mongoose.Error.CastError) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

if (require.main === module) {
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

export default app;
