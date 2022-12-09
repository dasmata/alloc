import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema= new Schema({
    name:{type: String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    rights:{type: Number, required:false},
    token: {type:String},
})



// module.exports= mongoose.model('User', userSchema);

export default  mongoose.model('User', userSchema);

