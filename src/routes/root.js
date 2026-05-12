import express from "express";

const test = express.Router();

test.get("/", (req, res) => {
  res.status(200).json({ message: "Server Live!" });
});

export default test;
