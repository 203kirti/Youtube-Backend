import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken" // for password encryption npm package // jwt is a bearer tokens 
import bcrypt from "bcrypt" // for password security encryption

const userSchema = new Schema(
    {
        username:{
            type:String, 
            required:true,
            index:true,
            unique:true,
            lowercase:true,
        }, 
        email:{
            type:String, 
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type:String, 
            required:true,
            lowercase:true,
            index:true
        },
        avatar:{
            type:String,  // cloudinary true
            required:true,
        },
        coverImage:{
            type:String,  // cloudinary true
        },
        watchHistory: [
            {
                type:Schema.Types.ObjectId,
                ref: "Vedio"
            }
        ],
        password: {
            type:String,
            required:[true,'password is required']
        },
        refreshToken :{
            type:String
        }
    },{
        timestamps: true
    }

)

// pre hook in middleware
userSchema.pre("save" , async function (next) {
    // not to encrypt password everytime , only when entered first time and when password is updated otherwise go to next
    if(!this.isModified("password")) return next

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// custom method for password check in mongoose
// bcrypt compare method to do so

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password , this.password)
}

// access token -- short lived

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email: this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// refresh token -- long lived

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , userSchema)