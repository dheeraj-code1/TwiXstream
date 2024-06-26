import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user_model.js";
import { deleteOnCloudinary, uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};

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
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "username or password already exist ");
  }

  // console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path || ""

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new Error(409, "Avatar is required");
  }

  const avatar = await uploadCloudinary(avatarLocalPath);
  console.log(avatar);
  const coverImage = await uploadCloudinary(coverImageLocalPath);

  // console.table(coverImage)

  if (!avatar) {
    throw new Error(409, "Avatar is required");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id);
  if (!createdUser) {
    throw new Error(500, "Problem in registering user");
  }
  // createdUser?.select(
  //   "-password -refreshToken"
  // )
  createdUser["password"] = undefined;
  createdUser["refreshToken"] = undefined;

  console.log(createdUser);
  return res
    .status(200)
    .json(new ApiResponse(201, createdUser, "user created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req.body ->data
  // username or email check -> empty, do not exit
  // find user
  // check the password
  // access and refresh tokens
  // send res

  const { username, email, password } = req.body;
  console.log(req.body);
  if ([username, email].some((user_data) => user_data?.trim() === "")) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exits");
  }

  const passwordValid = await user.isPasswordCorrect(password);
  if (!passwordValid) {
    throw new ApiError(404, "Invalid user credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log("user");
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, { user }, "Successfully user logout"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthrised request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invaild refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "expired refresh token");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newResfrshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newResfrshToken, options)
      .json(
        new ApiResponse(
          201,
          {
            accessToken,
            refreshToken: newResfrshToken,
          },
          "new access refresh token generated"
        )
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // check if user is logged in or not- using middleware
  // req.body -> data
  // check the oldPassword with DB
  // if same then change password
  // save password

  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, {}, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // check user is loggedIn-> using middelware
  // return the req.user

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: req.user },
        "current user fetched successfully"
      )
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  // check if user is logged in or not- using middleware
  // req.body -> data
  // change details

  const { fullName, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true } // only return the updated user if true
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Updated detaills succesfully "));
});

const updateAvatar = asyncHandler(async (req, res) => {
  // verify user, check loggin
  // upload new file using multer middleware, now have req.file
  // req.file -> avatar
  // upload on cluodinary
  // check if avatar.url
  // update in DB
  // return res
  console.log(req.file);
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "No avatar file found");
  }

  await deleteOnCloudinary(req?.user.avatar);

  const avatar = await uploadCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error: File is missing from cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Succesfully avatar changed"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  // verify user, check loggin
  // upload new file using multer middleware, now have req.file
  // req.file -> coverImage
  // upload on cluodinary
  // check if coverImage.url
  // update in DB
  // return res
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "No cover image file found");
  }
  const deletedCoverImage = await deleteOnCloudinary(req.user.coverImage);

  console.log(deletedCoverImage);
  const coverImage = await uploadCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(
      400,
      "Error: Cover image File is missing from cloudinary"
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Succesfully coverImage changed"));
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  // TODO: Handle the case when user is new

  const { username } = req.params;
  if (!username) {
    throw new ApiError(400, "username is missing ");
  }
  console.log(username);

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubcribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubcribed: 1,
      },
    },
  ]);
  if (!channel?.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "user profile feteched successfully"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "user profile feteched successfully")
    );

  // console.log("channel:",channel);
});

const getWatchHistory = asyncHandler(async (req, res) => {
  // TODO: Handle the case when user is new
  try {
    const user = User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                $first: "$owner",
              },
            },
          ],
        },
      },
    ]);
    console.log(user);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user[0]?.watchHistory,
          "Watch history feteched successfully..."
        )
      );
  } catch (error) {
    console.log("ERRORR:", error);
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getCurrentUserProfile,
  getWatchHistory,
};
