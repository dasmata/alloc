import express from 'express'
import passport from 'passport';
import bcrypt from 'bcrypt'


// import * as UserController from '../../conrollers/users-controller.js';
 import User from '../../models/user.js';


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


    res.status(200).json({userId:createdUser.id, email: createdUser.email, password: createdUser.password});

})

export default router;
