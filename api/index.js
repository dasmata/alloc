import express from 'express';
import loginRouter from './routes/user/login.js';
import cors from 'cors';

const app = express();

app.use(cors());

app.use('/v1.0/user/login', loginRouter)

app.listen(6001);
