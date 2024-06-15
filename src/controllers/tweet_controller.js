import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet_model.js";
import { User } from "../models/user_model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { tweetContent } = req.body;
  if (!tweetContent) {
    throw new ApiError(400,"Tweet content is required")
  }
  const tweet = await Tweet.create({
    owner: req.user._id,
    content: tweetContent,
  });
  if (!tweet) return new ApiError(404, "Unable to create tweet");

  return res.json(
    new ApiResponse(200, { tweet }, "tweet created successfully")
  );
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const {userId} = req.params
  if (!userId) {
    throw new ApiError(400,"User Id is required")
  }
  const tweetAggregate = await Tweet.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
  ]);
  const options = {
    page: 1,
    limit: 10,
  };

  const tweets = await Tweet.aggregatePaginate(tweetAggregate, options);
  // console.log(tweets["docs"]);

  return res.json(new ApiResponse(200, { tweets:tweets["docs"] }, "Fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(400,"Tweet Id is required")
  }
  const { newContent } = req.body; 
  const updatedTweet = await Tweet.findByIdAndUpdate(
     tweetId ,
    {
      $set: {
        content: newContent,
      },
    },
    { new: true }
  );

  return res.json(
    new ApiResponse(
      200,
      {  updatedTweet },
      "Updated successfully"
    )
  );
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(400,"Tweet Id is required")
  }
  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  return res.json(new ApiResponse(200, {deletedTweet}, "Deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
