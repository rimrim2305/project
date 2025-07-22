import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema({
  authorInfo: {
    authorID:    String,
    authorEmail: String,
    authorName:  String,
    authorRole:  String,
  },
  content:   String,
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const likeSchema = new Schema({
  authorID: String,
  likedAt:  { type: Date, default: Date.now }
}, { _id: false });

const postSchema = new Schema({
  content:   { type: String, required: true },
  imgSrc:    String,
  authorInfo:{
    authorID:    String,
    authorEmail: String,
    authorName:  String,
    authorRole:  String,
  },
  like:    [likeSchema],
  comment: [commentSchema]
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model("Post", postSchema);