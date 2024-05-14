import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user_model.js';
import {uploadCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
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
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All data is required");
  }
  const existedUser = User.findOne({
    $or:[{username},{email}]
  })

  if (existedUser) {
    throw new Error(409,"username or password already exist ")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path

  if (! avatarLocalPath) {
    throw new Error(409,"Avatar is required")
  }

  const avatar = await uploadCloudinary(avatarLocalPath)
  const coverImage = await uploadCloudinary(coverImageLocalPath)

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
  createdUser.select(
    "-password -refreshToken"
  )

  return res.status(200).json(
    new ApiResponse(201,createdUser,"user created successfully")
  )

});

export { registerUser };
