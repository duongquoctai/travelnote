import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  id: String,
  name: String,
  lat: Number,
  lon: Number,
  properties: {
    notes: String,
    links: [String],
  },
});

const JourneySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: "Vi vu",
    },
    locations: [LocationSchema],
  },
  {
    timestamps: true,
  },
);

const Journey =
  mongoose.models.Journey || mongoose.model("Journey", JourneySchema);

export default Journey;
