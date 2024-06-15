import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user_model.js";
import { Subscription } from "../models/subscription_model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!( channelId)) {
    throw new ApiError(400,"Channel Id is Required")
  }
  // TODO: toggle subscription
  const subscriber = await Subscription.findOne({
    $and: [{ channel: channelId }, { subscriber: req.user._id }],
  });
  if (subscriber) {
    const toggledSubscriber = await Subscription.deleteOne({$and: [{ channel: channelId }, { subscriber: req.user._id }]});
    console.log(req.user.username);
    return res.json(
      new ApiResponse(200, { toggledSubscriber,subscriber_name:req.user.username }, "Toggled subscriber state")
    );
  } else {
    const toggledSubscriber = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });

    return res.json(
      new ApiResponse(200, { toggledSubscriber,subscriber_name:req.user.username }, "Toggled subscriber state")
    );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!( channelId)) {
    throw new ApiError(400,"Channel Id is Required")
  }
  const subscribers = await Subscription.find({ channel: channelId });

  return res.json(new ApiResponse(200, { subscribers }, "Feteched"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!( subscriberId)) {
    throw new ApiError(400,"Subscriber Id is Required")
  }
// console.log("subscriberId  :::::  ",subscriberId);
// console.log("req.user._id  :::::  ",req.user._id);
  const channelList = await Subscription.find({ subscriber: subscriberId});
  // console.log(channelList);
  return res.json(new ApiResponse(200, { channelList }, "Feteched"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
