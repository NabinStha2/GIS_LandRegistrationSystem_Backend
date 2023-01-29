const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fuzzy = require("../utils/mongoose-fuzzy-search");

const LandSchema = new Schema(
  {
    city: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    longitude: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    parcelId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    wardNo: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    surveyNo: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    landPrice: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: String,
      required: true,
      default: "pending",
      index: true,
      enum: ["approved", "pending", "rejected"],
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

LandSchema.plugin(fuzzy, {
  fields: {
    name_tg: "parcelId",
  },
});
LandSchema.index({ name_tg: 1 });

const Land = mongoose.model("Land", LandSchema);
module.exports = Land;
