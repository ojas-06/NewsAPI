import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
  {
    imageUrl: {
      type: String,
      default: "",
    },
    title: {
      type: String,
    },
    short: {
      type: String,
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
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
