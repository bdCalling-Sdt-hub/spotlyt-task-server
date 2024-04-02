const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const referralSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    taskLink: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    status: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },
    registerData: {
      type: Object,
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

referralSchema.plugin(paginate);

module.exports = mongoose.model("Referral", referralSchema);
