import express, {Express, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { elevatorsRouter } from './routes/elevatorsRouter';
import { auth, requiresAuth } from 'express-openid-connect';

// Load environment variables
dotenv.config();
const port = process.env.PORT || 3000;
const mongoDB = process.env.DB_URL;
const app : Express = express();

// OpenID Connect configuration
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: `${process.env.BASE_URL}:${port}`,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
};

// Connect to MongoDB
mongoose.set('strictPopulate', false);
mongoose.Promise = Promise;
mongoose.connect(mongoDB);
mongoose.connection.on('error', (error: Error) => console.error(error));


// Middleware
app.use(express.json());
app.use(auth(config));
app.use('/elevators', requiresAuth());
app.use((req, res, next) => {
    console.log('Request:', req.oidc.user);
    next();
  });

// Routes
app.use('/', elevatorsRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // CastError (refers to query parameter)
    if (err instanceof mongoose.Error.CastError) {
        return res.status(404).json({ message: 'Not found' });
    } 
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

//   Add the requiresAuth middleware for routes that require authentication. Any route using this middleware will check for a valid user session and, if one does not exist, it will redirect the user to log in.
  app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

if (require.main === module) {
    app.listen(port, () => console.log(`Server is running on port ${port}`));
}

export default app;