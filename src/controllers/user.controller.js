import {asyncHandler} from "../utils/asyncHandler.js"; 
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken , refreshToken}

    }catch(error){
        throw new ApiError(500, "something went wrong while generating refresh and access Token")
    }
}

const registerUser = asyncHandler( async (req, res) => { 

        const {fullname , email , username , password } = req.body
        console.log("email ", email );

        if(
            [fullname, email, username, password].some( (field) => 
            field?.trim() === "")
        ){
            throw new ApiError(400 , "All fields are required!")
        }

        const existedUser = await User.findOne({
            $or: [{ email } , { username }]
        })

        if (existedUser) {
            throw new ApiError(409 , "User with email or username already exits ")
        }

        const avatarLocalPath = req.files?.avatar?.[0].path;
        //const coverImageLocalPath = req.files?.coverImage[0]?.path;

        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
git
        if( !avatarLocalPath ) {
            
            console.error("Avatar file is missing in req.files:", req.files);
            throw new ApiError(400 ,"Avatar file is required  ")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if( !avatar ){
            throw new ApiError(400 , "avatar is required")
        }

        const user = await User.create({
            fullname ,
            avatar: avatar.url,
            coverImage: coverImage?.url || "" ,
            email , 
            password,
            username: username.toLowerCase() 
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        
        if(!createdUser) {
            throw new  ApiError(500 , "Something went wrong while registering the user")
        }

        return res.status(201).json(
             new ApiResponse(200 , createdUser , "user registered successfully")
        )
    })

const loginUser = asyncHandler(async (req, res) =>{
    // algo

    // req-body => data
    // username or email access
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const {email , username , password} = req.body

    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }
    /* 
    // if any one username or email is needed

    if( !(username || email) ){
    throw new ApiError(400, "username or email is required")
    }
    */
    const user =await User.findOne({
        $or: [{username} , {email}]
    })

    if(!user){
        throw new ApiError(404 ,"User does not exit")
    }
    
   const isPasswordValid =  await user.isPasswordCorrect(password)
   
   if (!isPasswordValid) {
    throw new ApiError(401 , "Invalid user credentials")
   }

   const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
    httpOnly: true,
    secure: true
   }

   return res
   .status(200)
   .cookie("accessToken" , accessToken , options)
   .cookie("refreshToken" , refreshToken , options)
   .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
   )

})

const logoutUser = asyncHandler(async(req , res) => {
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
            {
                new: true
            }
        
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401 , "unauthorized request")
    }
    try { 
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        
        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError( 401, "Refresh token is expired or used" )
        }

        const options = {
            httpOnly:true,
            secure:true
        }

        const {accessToken , newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
        .status(200)
        .cookie("accessToken" , accessToken , options)
        .cookie("refreshToken", newRefreshToken , options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"
            )
        )
    } catch(error){
    throw new ApiError(401, error?.message || "invalid refresh token")
    }
})   

export {
    registerUser ,
    loginUser,
    logoutUser,
    refreshAccessToken
}



/*     
// alogrithm

        // get user details from frontend
        // validation - not empty
        // check if uer already exists : username or email se check
        // check for images , check for avatar
        // upload on cloudinary , avatar check confirmation of upload
        // create user object- create entry in db
        // remove password and refresh token field from response
        // check for user creation
        // return response 

        */
// go on the postman http://localhost:8000/api/v1/users/register POST and send this  
// registerUser is an asynchronous function wrapped by asyncHandler.
// Parameters:  
// / res.status(200).json({
    //     message:"ok" 
// req: Represents the HTTP request object, which contains data sent by the client    (eg., user input).
// res: Represents the HTTP response object, used to send data back to the client.
// It sends a JSON response with a 200 status code and a message "ok".
// When a POST request is made to /register, the registerUser function is called to handle the request.