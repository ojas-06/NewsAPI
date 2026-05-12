import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
  {
    imageUrl: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      // required: true,
    },
    short: {
      type: String,
      // required: true,
    },
    content: {
      type: String,
    },
    author: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
    },
    sourceUrl: {
      type: String,
      // required: true,
    },
    category: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
