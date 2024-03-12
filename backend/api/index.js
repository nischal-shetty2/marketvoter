const express = require("express");
const bodyParser = require("body-parser");
const { bullishS, bearishS } = require("../db");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ msg: "backend api for market-voter" });
});

app.get("/bullish", async (req, res) => {
  try {
    const bullish = await bullishS.findOne({});
    res.json(bullish);
  } catch (error) {
    console.error("Error fetching bullish votes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/bearish", async (req, res) => {
  try {
    const bearish = await bearishS.findOne({});
    res.json(bearish);
  } catch (error) {
    console.error("Error fetching bearish votes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/bullish", async (req, res) => {
  try {
    let { bullish } = req.body;
    bullish = parseInt(bullish);
    await bullishS.updateOne({ _id: "65a4aea2d47e61491c2d5cb5" }, { bullish });
    res.json({ msg: "Updated bullish votes" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/bearish", async (req, res) => {
  try {
    let { bearish } = req.body;
    bearish = parseInt(bearish);
    await bearishS.updateOne({ _id: "65a4af07d47e61491c2d5cba" }, { bearish });
    res.json({ msg: "Updated bearish votes" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT || 3000);
