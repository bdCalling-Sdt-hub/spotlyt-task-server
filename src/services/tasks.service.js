const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const { Tasks, Service } = require("../models");
const { userService } = require(".");

const createTask = async (userId, bodyData) => {
  const user = await userService.getUserById(userId);
  const service = await Service.findOne({ _id: bodyData.serviceId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }

  const data = {
    ...bodyData,
    userId: user._id,
    type: service.type,
  };
  const task = await Tasks.create(data);
  return task;
};

const queryTasks = async (filter, customOptions, type, userId) => {
  const defaultOptions = {
    sortBy: "createdAt:desc",
    limit: 10,
    page: 1,
    populate: "serviceId,userId fullName image",
  };

  const options = { ...defaultOptions, ...customOptions };

  const result = await Tasks.paginate(filter, options);
  return result;
};

const getTaskById = async (id) => {
  const task = await Tasks.findById(id).populate("userId serviceId");
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
  }
  return task;
};

const deleteTaskById = async (id) => {
  const task = await Tasks.findByIdAndDelete(id);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
  }
  return task;
};

const updateTaskById = async (id, bodyData, image) => {
  const task = await getTasksById(id);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
  }
  if (image) {
    task.image = image;
  }

  Object.assign(task, bodyData);
  await task.save();
  return task;
};

const getAdminTasks = async (type) => {
  const task = await Tasks.find({ type }).populate("userId serviceId");
  return task;
};
const taskHome = async (userId, type, page = 1, limit = 10) => {
  console.log(type)
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  let query = {
    quantity: { $gt: 0 },
    status: "pending"
  };

  // Get the current date without the time component
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If type is "today", add additional condition to filter by today's date
  if (type === "today") {
    query.createdAt = { $gte: today };
  }
  // If type is "others", add additional condition to filter by other than today's date
  else if (type === "others") {
    query.createdAt = { $lt: today };
  }

  // Find the total count of tasks
  const totalCount = await Tasks.countDocuments(query);

  // Calculate the number of pages
  const totalPages = Math.ceil(totalCount / limit);

  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  // Find tasks based on the query, with pagination
  const tasks = await Tasks.find(query)
    .populate("userId")
    .populate("serviceId")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    tasks,
    page,
    limit,
    totalPages,
    totalResults: totalCount,
  };
};




module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  deleteTaskById,
  updateTaskById,
  getAdminTasks,
  taskHome,
};
