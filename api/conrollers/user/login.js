import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../../models/user.js';


export  async function login (req,res,next) {

    const{ email, password} = req.body;

    const existingUser=await User.findOne({email:email});
    if(!existingUser){
       return res.status(400).send('Invalid credentials,could not log you in');
       
    }

    const isValidPassword = await bcrypt.compare(password,existingUser.password);
    if(!isValidPassword){
        return res.status(400).send('Invalid credentials,could not log you in');
    }

    let token;
    try{
        token=jwt.sign(
          {userId:existingUser.id,email:existingUser.email},
          process.env.KEY_ONE,
          {expiresIn:'10m'}
        );
    } catch(err){
        console.error(err);
        return res.status(400).send('signup failed');
    }


    let refreshToken= jwt.sign(
        { email:existingUser.email },
        process.env.KEY_TWO,
        { expiresIn:'1h' }
    );

    res.cookie('jwt', refreshToken, {httpOnly:true});
    res.status(200).json({userId:existingUser.id, email: existingUser.email, token:token});

}


export  async function refreshToken (req,res,next) {

    if(req.cookies?.jwt){
        const refreshToken=req.cookies.jwt;

       jwt.verify(refreshToken, process.env.KEY_TWO, (err,decoded)=>{
            if(err){
                return res.status(400).json({message:'unauthorized 1'});
            }else{
                const token=jwt.sign({
                    userId:req.body.id,
                    email:req.body.email
                },process.env.KEY_ONE,{expiresIn:'10m'});
                return res.json({token});
            }
        })
    }else{
        return res.status(400).json({message:'unauthorized 2'});
    }
};
