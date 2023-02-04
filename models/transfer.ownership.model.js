const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransferOwnershipSchema = new Schema(
  {
    landSaleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandSale",
      required: true,
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    transerData: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
      index: true,
      required: true,
    },
  },
  { timestamps: true }
);

const TransferOwnership = mongoose.model(
  "TransferOwnership",
  TransferOwnershipSchema
);
module.exports = TransferOwnership;
