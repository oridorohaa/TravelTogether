const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    fromDate: {
      type: String,
      reqiured: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
