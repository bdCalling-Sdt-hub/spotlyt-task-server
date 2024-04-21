const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const interestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
interestSchema.plugin(paginate);

module.exports = mongoose.model("Interest", interestSchema);
