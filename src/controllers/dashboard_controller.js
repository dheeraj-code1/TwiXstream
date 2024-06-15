import mongoose from "mongoose";
import { Video } from "../models/video_model.js";
import { Subscription } from "../models/subscription_model.js";
import { Like } from "../models/like_model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const allVideos = await Video.find({ owner: req.user._id });
  let totalViews = 0;
  allVideos.forEach((video) => {
    totalViews = totalViews + video?.views;
  });

  const totalSubs = await Subscription.find({ channel: req.user._id });

  const totalVideo = allVideos.length;
  const totalLike = await Like.aggregate([
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
        as: "allLikedVideos",
      },
    },
    {
      $addFields: {
        likeCount: {
          $size: "$allLikedVideos",
        },
      },
    },
    {
      $project: {
        likeCount: 1,
      },
    },
  ]);

  return res.json(
    new ApiResponse(200, {
      totalViews,
      totalSubs:totalSubs.length,
      totalVideo,
      totalLike,
    })
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  
  const videoAggregate = await Video.aggregate([
    {
      $match: {
        owner: req.user._id,
      },
    },
  ]);

  const options = {
    page: 1,
    limit: 10,
  };

  const allVideos = await Video.aggregatePaginate(videoAggregate, options);

  return res.json(new ApiResponse(200, { allVideos:allVideos.docs }, "All videos fetched"));
});

export { getChannelStats, getChannelVideos };
