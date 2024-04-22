const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const serviceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  },
  { timestamps: true }
);

serviceCategorySchema.plugin(paginate);

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
