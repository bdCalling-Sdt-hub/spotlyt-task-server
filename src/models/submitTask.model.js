const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const submitTaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
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
    price: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

submitTaskSchema.plugin(paginate);

module.exports = mongoose.model("SubmitTask", submitTaskSchema);
