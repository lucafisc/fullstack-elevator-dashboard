import express, {Express, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { elevatorsRouter } from './routes/elevatorsRouter';

// Load environment variables
dotenv.config();
const port = process.env.PORT || 3000;
const mongoDB = process.env.DB_URL;
const app : Express = express();

// Connect to MongoDB
mongoose.set('strictPopulate', false);
mongoose.Promise = Promise;
mongoose.connect(mongoDB);
mongoose.connection.on('error', (error: Error) => console.error(error));


// Middleware
app.use(express.json());
app.use('/', elevatorsRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});


app.listen(port, () => console.log(`Server is running on port ${port}`))