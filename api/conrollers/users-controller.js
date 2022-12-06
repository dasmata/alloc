import User from '../models/user';

export const signup = ( req, res) => {
    console.log(req.body);
    User.findOne({email:req.body.email}).then((user)=>{
        
        if(user){
            return res.status(400).json({email:'a user has already registered with this email'})
        }else{
            const newUser = new User({
                name:req.body.name,
                email:req.body.email
        });
        newUser.save()
        return res.status(200).json({msg:newUser})
        }
    })
}
