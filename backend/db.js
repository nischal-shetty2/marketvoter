const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

mongoose.connect(process.env.MONGODB_URL);

const bullishSchema = mongoose.Schema({
  bullish: Number,
});

const bearishSchema = mongoose.Schema({
  bearish: Number,
});

const bullishS = mongoose.model("bullishSchema", bullishSchema);
const bearishS = mongoose.model("bearishSchema", bearishSchema);

module.exports = {
  bullishS,
  bearishS,
};
