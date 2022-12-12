import express, { application, json } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import userRouter from './routes/user/user.js';

dotenv.config({path:'./config/config.env'});

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/v1.0/user',userRouter)

const PORT= process.env.PORT ;
mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(PORT);
        console.log('connected to db');
    })
    .catch( err=>{
        console.log(err);

    });