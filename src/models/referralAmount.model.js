const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const referralAmountSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
referralAmountSchema.plugin(paginate);

module.exports = mongoose.model("ReferralAmount", referralAmountSchema);
