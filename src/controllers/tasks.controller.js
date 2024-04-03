const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { crewService, tasksService } = require("../services");
const unlinkImage = require("../common/unlinkImage");
const { Service } = require("../models");

const createTask = catchAsync(async (req, res) => {
  const task = await tasksService.createTask(req.user.id,req.body);
  res.status(httpStatus.CREATED).json(response({
    message: "Task Created Successfully",
    status: "OK",
    statusCode: httpStatus.CREATED,
    data: task,
  }));
});


const getTask = catchAsync(async (req, res) => {
  const blog = await crewService.getCrewById(req.params.crewId);
  res
    .status(httpStatus.OK)
    .json(
      response({
        message: "Task",
        status: "OK",
        statusCode: httpStatus.OK,
        data: blog,
      })
    );
});

const getTasks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["title"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await crewService.queryCrews(filter, options);
  res
    .status(httpStatus.OK)
    .json(
      response({
        message: "All Tasks",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
});

const updateTask = catchAsync(async (req, res) => {
  const { crewId } = req.params;
  const { sessions, crewLeaders, affiliations, ...crewData } = req.body;

  // Parse sessions, crewLeaders, affiliations from strings to arrays if needed
  const parsedSessions = JSON.parse(sessions);
  const parsedCrewLeaders = JSON.parse(crewLeaders);
  const parsedAffiliations = JSON.parse(affiliations);

  const updatedCrewData = {
    ...crewData,
    sessions: parsedSessions,
    crewLeaders: parsedCrewLeaders,
    affiliations: parsedAffiliations
  };

  // Check if an image is uploaded
  const image = {};
  if (req.file) {
    image.url = "/uploads/crews/" + req.file.filename;
    image.path = req.file.path;
  }

  // Update crew data
  const updatedTask = await crewService.updateCrewById(crewId, updatedCrewData, image);

  res.status(httpStatus.OK).json(response({
    message: "Task Updated Successfully",
    status: "OK",
    statusCode: httpStatus.OK,
    data: updatedCrew,
  }));
});

const deleteTask = catchAsync(async (req, res) => {
  const blog = await crewService.deleteCrewById(req.params.crewId);
  res
    .status(httpStatus.OK)
    .json(
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
  res
    .status(httpStatus.OK)
    .json(
      response({
        message: "All Tasks",
        status: "OK",
        statusCode: httpStatus.OK,
        data: service,
      })
    );
});



module.exports = {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask,
  homeServiceList
};
