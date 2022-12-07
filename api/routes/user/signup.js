import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// import * as UserController from '../../conrollers/users-controller.js';
 import User from '../../models/user.js';
import user from '../../models/user.js';


const router = express.Router();

// router.post('/signup',UserController.signup)


// router.post('/signup', (req, res) => {
//     console.log(req.body);
//     User.findOne({email:req.body.email}).then((user)=>{
        
//         if(user){
//             return res.status(400).json({email:'a user has already registered with this email'})
//         }else{
//             const newUser = new User({
//                 name:req.body.name,
//                 email:req.body.email
//         });
//         newUser.save()
//         return res.status(200).json({msg:newUser})
//         }
//     })
// })

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


router.post('/login', async (req,res)=>{ 
    const{ email, password} = req.body;
    //console.log(req.body);

    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        return res.status(400);
    }

    if(!existingUser){
       res.status(400).send('Invalid credentials,could not log you in');
       
    }

    let isValidPassword = false;
    try{
         isValidPassword = await bcrypt.compare(password,existingUser.password)
    }catch(err){
       console.error(err);
       return res.status(500);
    }

    if(!isValidPassword){
        res.status(400).send('Invalid credentials,could not log you in');
    }

    let token;
    try{
        token=jwt.sign(
          {userId:existingUser.id,email:existingUser.email},
          'do_not_share',
          {expiresIn:'1h'}
        );
    }catch(err){
        console.error(err);
        res.status(400).send('signup failed');
    }

    // res.status(200).json({ userId:existingUser.id, email: existingUser.email});
    res.status(200).json({ userId:existingUser.id, email: existingUser.email,token:token});

})






export default router;
