import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../../models/user.js';

const router = express.Router();

// router.post('/', (req, res) => {
//     res.json({
//         name: 'Tiberiu',
//         token: 'jwiwmc943uwk3-04kdf-3832d,jsowsdnjr',
//         rights: 2
//     })
// })

router.get('/google', (req, res) => {
    res.sendStatus(404)
})

router.post('/', async (req,res)=>{ 
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
         isValidPassword = await bcrypt.compare(password,existingUser.password);
    }catch(err){
       console.error(err);
       return res.status(500);
    }

    if(!isValidPassword){
        res.status(400).send('Invalid credentials,could not log you in');
    }else{ }

    let token;
    try{
        token=jwt.sign(
          {userId:existingUser.id,email:existingUser.email},
          'do_not_share',
          {expiresIn:'10m'}
        );
    }catch(err){
        console.error(err);
        res.status(400).send('signup failed');
    }


    let refreshToken= jwt.sign(
        {email:existingUser.email},
        'another_do_not_share',
        {expiresIn:'1h'}
    );

    res.cookie('jwt',refreshToken,{httpOnly:true});


    res.status(200).json({userId:existingUser.id, email: existingUser.email,token:token});

})

router.post('/refresh',async (req,res) =>{

    if(req.cookies?.jwt){
        const refreshToken=req.cookies.jwt;

       jwt.verify(refreshToken, 'another_do_not_share', (err,decoded)=>{
            if(err){
                return res.status(400).json({message:'unauthorized 1'});
            }else{
                const token=jwt.sign({
                    userId:req.body.id,
                    email:req.body.email
                },'do_not_share',{expiresIn:'10m'});
                return res.json({token});
            }
        })
    }else{
        return res.status(400).json({message:'unauthorized 2'});
    }
});



export default router;
