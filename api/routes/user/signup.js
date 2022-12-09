import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/user.js';


const router = express.Router();


router.post('/', async (req,res)=>{
    const{ name, email, password} = req.body;

    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        return res.status(400);
    }

    if(existingUser){
        return res.status(400).send('user exist already, please login instead');

    }

    let hashedPassword;
    try{
        hashedPassword= await bcrypt.hash(password,12);
    }catch(err){
       console.log('could not create user');
        return res.status(400);
    }


    const createdUser= new User({
        name,
        email,
        password:hashedPassword
    });

    try{
        await createdUser.save();
    }catch(err){
        return res.status(400);
    }

    let token;
    try{
        token = jwt.sign(
        {userId: createdUser.id, email:createdUser.email},
        'do_not_share',
        {expiresIn:'1h'}
         );
    }catch(err){
        res.status(400).send('signup failed');
    }

    createdUser.token=token;

    
    res.status(200).json({userId:createdUser.id, email: createdUser.email, password: createdUser.password, token:token});

})




export default router;
