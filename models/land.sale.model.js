const mongoose = require("mongoose");

const LandSaleSchema = new mongoose.Schema({
  landId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "Land",
  },
  parcelId: {
    type: String,
    required: true,
    index: true,
  },
  ownerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "User",
  },
  saleData: {
    type: String,
    default: "selling",
    enum: ["selling", "processing", "selled", "rejected"],
    index: true,
    required: true,
  },
  prevOwnerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  requestedUserId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  rejectedUserId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  approvedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const LandSale = mongoose.model("LandSale", LandSaleSchema);
module.exports = LandSale;
