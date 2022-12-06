import express from 'express'
import passport from 'passport';
import bcrypt from 'bcrypt'
import User from '../../models/user.js';


const router = express.Router();

// router.post('/', (req, res) => {
//     res.json({
//         name: 'Tiberiu',
//         token: 'jwiwmc943uwk3-04kdf-3832d,jsowsdnjr',
//         rights: 2
//     })
// })

router.post('/', async (req,res)=>{ 
    const{ email, password}=req.body;
    console.log(req.body);
    let existingUser;

    const user= await User.findOne({email:email});
    console.log('user',user);

    try{
        existingUser=await User.findOne({email:email});
        console.log(existingUser);
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

    res.status(200).json({ userId:existingUser.id, email: existingUser.email});
})

router.get('/google', (req, res) => {
    res.sendStatus(404)
})

export default router;
