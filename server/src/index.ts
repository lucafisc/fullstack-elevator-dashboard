import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
import { elevatorsRouter } from "./routes/elevatorsRouter";
import axios from "axios";
import { getUserInfo } from "./controllers/userController";


// Load environment variables
dotenv.config();
const port = process.env.PORT || 3000;
const mongoDB = process.env.DB_URL;
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
    jwksUri: "https://dev-a0oir8yzhmnp7jh3.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "this is a unique identifier",
  issuer: "https://dev-a0oir8yzhmnp7jh3.us.auth0.com/",
  algorithms: ["RS256"],
}).unless({ path: ["/"] });

// Middleware
app.use(jwtCheck);
app.use(cors());
app.use(express.json());
app.use(getUserInfo);

// Routes
app.use("/", elevatorsRouter);

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
