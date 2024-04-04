const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { tasksService } = require("../services");
const { Service } = require("../models");

const createTask = catchAsync(async (req, res) => {
  const task = await tasksService.createTask(req.user.id, req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Task Created Successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: task,
    })
  );
});

const getTask = catchAsync(async (req, res) => {
  const blog = await tasksService.getTaskById(req.params.taskId);
  res.status(httpStatus.OK).json(
    response({
      message: "Task",
      status: "OK",
      statusCode: httpStatus.OK,
      data: blog,
    })
  );
});

const getTasks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["userId"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await tasksService.queryTasks(
    filter,
    options,
    req.user.type,
    req.user.id
  );
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});



const deleteTask = catchAsync(async (req, res) => {
  const blog = await crewService.deleteCrewById(req.params.crewId);
  res.status(httpStatus.OK).json(
    response({
      message: "Task Deleted Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: blog,
    })
  );
});

const homeServiceList = catchAsync(async (req, res) => {
  const service = await Service.find();
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: service,
    })
  );
});

const getAdminTasks = catchAsync(async (req, res) => {

  const result = await tasksService.getAdminTasks(req.query.type)
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const taskHome = catchAsync(async (req, res) => {
  const result = await tasksService.taskHome(req.user.id, req.query.type, req.query.page, req.query.limit);
  res.status(httpStatus.OK).json(
    response({
      message: "All Tasks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

module.exports = {
  createTask,
  getTask,
  getTasks,
  deleteTask,
  homeServiceList,
  getAdminTasks,
  taskHome
};
