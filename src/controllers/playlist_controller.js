import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "./../models/playlist_model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!(name && description)) {
    throw new ApiError(400,"name or description is required")
  }
  //TODO: create playlist
  // req.body -> data
  const playList = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });
 if (!playList) {
  throw new ApiError(500,"Unable to create playlist")
 }
  return res.json(new ApiResponse(200, { playList }, "Created Succesfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400,"User Id is Required")
  }
  //TODO: get user playlists
  const playlistAggregate = await Playlist.aggregate([
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

  const playLists = await Playlist.aggregatePaginate(
    playlistAggregate,
    options
  );

  return res.json(
    new ApiResponse(200, { playLists:playLists.docs }, "Fetched user playlists")
  );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    throw new ApiError(400,"Playlist Id is Required")
  }
  //TODO: get playlist by id
  const playlist = await Playlist.findById(playlistId);
  // console.log(playlistId);
  if (!playlist) {
    throw new ApiError(400,"Playlist does not exit")
  }
  return res.json(new ApiResponse(200, { playlist }, "Feteched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoId,playlistId } = req.params;
  if (!( videoId && playlistId)) {
    throw new ApiError(400,"Video Id And Playlist Id are Required")
  }
  const playlist = await Playlist.findById(playlistId);
// console.log(playlistId);
if (!playlist) {
  throw new ApiError(400,"Playlist does not exit")
}
  playlist?.videos.push(videoId);
  await playlist.save();

  return res.json(new ApiResponse(200, {playlist}, "Added successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!( videoId && playlistId)) {
    throw new ApiError(400,"Video Id And Playlist Id are Required")
  }
  // TODO: remove video from playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400,"Playlist does not exit")
  }
  const index = playlist?.videos.indexOf(videoId);

  playlist?.videos.splice(index,1)
  await playlist.save();

  return res.json(
    new ApiResponse(
      200,
      { videos: playlist.videos },
      "Removed video from playlist"
    )
  );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!( playlistId)) {
    throw new ApiError(400,"Playlist Id is Required")
  }
  // TODO: delete playlist
  await Playlist.findByIdAndDelete(playlistId);

  return res.json(new ApiResponse(200, {}, "Deleted videos"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!( playlistId)) {
    throw new ApiError(400,"Playlist Id is Required")
  }
  const { name, description } = req.body;
  //TODO: update playlist
  const platlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
    },
    { new: true }
  );
  console.log(platlist);

  return res.json(new ApiResponse(200, { platlist }, "Playlist updated"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
