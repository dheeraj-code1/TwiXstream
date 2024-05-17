import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user_model.js';
import {uploadCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async(userId)=>{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save()
    return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(500,"Failed to generate tokens")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // take data from frontend
  // validate data
  // check for avatar and coverimage
  // upload on cloudinary
  // make object of user data and store in DB
  // remove password and refresh token from response
  // send response to frontend

  const { fullName, email, username, password } = req.body;
  // console.log("email: ", email);
  // console.log("fullName: ",fullName);
  // console.table(req.body)
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All data is required");
  }
  const existedUser = await User.findOne({
    $or:[{username},{email}]
  })

  if (existedUser) {
    throw new Error(409,"username or password already exist ")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  // const coverImageLocalPath = req.files?.coverImage[0]?.path || ""

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if (! avatarLocalPath) {
    throw new Error(409,"Avatar is required")
  }

  const avatar = await uploadCloudinary(avatarLocalPath)
  const coverImage = await uploadCloudinary(coverImageLocalPath)

  // console.table(coverImage)

  if (!avatar) {
    throw new Error(409,"Avatar is required")
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    username:username.toLowerCase()
  })

  const createdUser = await User.findById(user._id)
  if (!createdUser) {
    throw new Error(500,"Problem in registering user")
  }
  // createdUser?.select(
  //   "-password -refreshToken"
  // )
  createdUser['password'] = undefined
  createdUser['refreshToken'] = undefined

  console.log(createdUser);
  return res.status(200).json(
    new ApiResponse(201,createdUser,"user created successfully")
  )

});

const loginUser = asyncHandler(async(req,res)=>{
  // req.body ->data
  // username or email check -> empty, do not exit
  // find user
  // check the password
  // access and refresh tokens
  // send res

  const {username,email,password} = req.body

  if (
    [username,email].some((user_data)=> user_data?.trim()==="")
  ) {
    throw new ApiError(400,"username or email is required")
  }

  const user = await User.findOne({
    $or:[{username},{email}]
  })

  if (!user) {
    throw new ApiError(404,"User does not exits")
  }

  const passwordValid = await user.isPasswordCorrect()
  if (!passwordValid) {
    throw new ApiError(404,"Invalid user credentials")
  }

  const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly:true,
    secure:true
  }
  
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(new ApiResponse(
    201,{
      user:loggedInUser,
      accessToken,
      refreshToken
    },
    "User logged in successfully"
  ))

})

const logoutUser = asyncHandler(async(req,res)=>{

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
  )
  const options = {
    httpOnly:true,
    secure:true
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(201,{},"Successfully user logout"))
})
export { registerUser,
  loginUser,
  logoutUser
 };
