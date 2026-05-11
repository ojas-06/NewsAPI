import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  article: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Article" 
  },
  content: {
    type: String,
    required: true
  }
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
