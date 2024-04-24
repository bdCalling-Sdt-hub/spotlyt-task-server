const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const taskSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["socialMedia", "video","corporate"],
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    transactionId: {
      type: String,
      required: false,
    },
    interest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interest",
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "failed", "pending"],
      default: "pending",
    },
    timelinesStart: {
      type: Date,
      required: false,
    },
    timelinesEnd: {
      type: Date,
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
    },
    count: {
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

taskSchema.plugin(paginate);

module.exports = mongoose.model("Task", taskSchema);
