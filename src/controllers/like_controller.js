import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like_model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "video Id is missing");
  }

  //TODO: toggle like on video
  // find the video
  // remove video id from liked videos
  let videoLike = await Like.findOne({
    likedBy: req.user._id,
  });
  if (!videoLike) {
    videoLike = await Like.create({ likedBy: req.user._id });
  }

  if (videoLike.video.includes(videoId)) {
    const index = videoLike.video.indexOf(videoId);
    videoLike.video.splice(index, 1);
  } else {
    videoLike.video.push(videoId);
  }

  await videoLike.save();
  return res.json(new ApiResponse(200, { videoLike }, "success"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "video Id is missing");
  }

  //TODO: toggle like on comment
  // find the commentId
  // remove the commetn like from
  let commmetLike = await Like.findOne({ likedBy: req.user._id });
  if (!commmetLike) {
    commmetLike = await Like.create({ likedBy: req.user._id });
  }

  if (commmetLike.comment.includes(commentId)) {
    const index = commmetLike.comment.indexOf(commentId, 1);
    commmetLike.comment.splice(index, 1);
    console.log(index);
  } else {
    commmetLike.comment.push(commentId);
  }

  await commmetLike.save();
  return res.json(new ApiResponse(200, { data: commmetLike }, "success"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(400, "video Id is missing");
  }

  //TODO: toggle like on tweet
  let tweetLike = await Like.findOne({ likedBy: req.user._id });
  if (!tweetLike) {
    tweetLike = await Like.create({ likedBy: req.user._id });
  }
  if (tweetLike?.tweet.includes(tweetId)) {
    const index = tweetLike.tweet.indexOf(tweetId);
    tweetLike.tweet.splice(index, 1);
  } else {
    tweetLike.tweet.push(tweetId);
  }
  await tweetLike.save();
  return res.json(new ApiResponse(200, { tweetLike }, "success"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const totalLikeVideos = await Like.aggregate([
    {
      $match: {
        likedBy: req.user._id,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $project: {
              videoFile: 1,
              thumbnail: 1,
              title: 1,
              description: 1,
              duration: 1,
              views: 1,
              isPublic: 1,
              owner: 1,
            },
          },
          
        ],
      },
    },
    {
        $addFields: {
          count: { $size: "$videos" },
        },
      },
    {
      $project: {
        videos: 1,
        count:1
      },
    },
  ]);
// console.log(totalLikeVideos);
  return res.json(
    new ApiResponse(200, {  totallikevideos:totalLikeVideos}, "success")


  );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
