const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const SingleServiceCategorySchema = new mongoose.Schema(
  {
    serviceCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

SingleServiceCategorySchema.plugin(paginate);

module.exports = mongoose.model("SingleServiceCategory", SingleServiceCategorySchema);
