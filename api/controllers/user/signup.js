import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/user.js';


export default async function signup (req,res,next) {
    const{ name, email, password} = req.body;

    const existingUser = await User.findOne({email:email});
    if(existingUser){
        return res.status(400).send('user exist already, please login instead');

    }

    const hashedPassword= await bcrypt.hash(password,12);

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

    
    try{
        const token = jwt.sign(
        {userId: createdUser.id, email:createdUser.email},
        process.env.KEY_ONE,
        {expiresIn:'1h'}
         );
        createdUser.token=token;
    }catch(err){
        return res.status(400).send('signup failed');
    }


    res.status(200).json({userId:createdUser.id, email: createdUser.email, password: createdUser.password, token:createdUser.token});

}
