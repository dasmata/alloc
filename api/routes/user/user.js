import express from 'express';
import {login,refreshToken} from '../../controllers/user/login.js';
import signup from '../../controllers/user/signup.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/refreshToken',refreshToken);


export default router;