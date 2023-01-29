const mongoose = require("mongoose");

const LandSaleSchema = new mongoose.Schema({
  landId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "Land",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "User",
  },
  saleData: {
    type: String,
    default: "pending",
    enum: ["pending", "approved"],
    index: true,
    required: true,
  },
  prevOwnerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "User",
  },
});

LandSaleSchema.plugin(fuzzy, {
  fields: {
    name_tg: "landId",
  },
});
LandSaleSchema.index({ name_tg: 1 });

const LandSale = mongoose.model("LandSale", LandSaleSchema);
module.exports = LandSale;
