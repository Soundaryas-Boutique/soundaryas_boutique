import mongoose,{Schema} from "mongoose";


mongoose.connect(process.env.MONGODB_URI)
mongoose.promise = global.Promise
const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    phone:Number,
    address:String,
    
    
},
{
    timestamps: true,
});
const User = mongoose.models.User || mongoose.model("User",userSchema);
export default User;