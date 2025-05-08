import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { loadApi } from './config/api';
import { setLimiterOptions, getLimiterMiddleware } from './middleware/limiter';

//setLimiterOptions(60, 100, 'Too many requests, please try again later.', 429);
const limiter = getLimiterMiddleware();

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
if(limiter){
    app.use(limiter);
}


loadApi(app, '../API');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});