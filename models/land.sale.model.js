const mongoose = require("mongoose");
const fuzzy = require("../utils/mongoose-fuzzy-search");

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
    enum: ["selling", "selled"],
    index: true,
    required: true,
  },
  prevOwnerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

LandSaleSchema.plugin(fuzzy, {
  fields: {
    name_tg: "parcelId",
  },
});
LandSaleSchema.index({ name_tg: 1 });

const LandSale = mongoose.model("LandSale", LandSaleSchema);
module.exports = LandSale;
