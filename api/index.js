import express, { application, json } from 'express';
import loginRouter from './routes/user/login.js';
import signupRouter from './routes/user/signup.js'
import cors from 'cors';
import mongoose from 'mongoose';
const app = express();

app.use(cors());
app.use(express.json())


app.use('/v1.0/user/signup',signupRouter)
app.use('/v1.0/user/login', loginRouter)



mongoose.set('strictQuery', true);
mongoose
    .connect('mongodb+srv://dbase:dbase@cluster0.zguntju.mongodb.net/test?retryWrites=true&w=majority')
    .then(()=>{
        app.listen(6001);
        console.log('connected to db');
    })
    .catch( err=>{
        console.log(err);

    });