const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { tasksService } = require("../services");
const { Service } = require("../models");
const ApiError = require("../utils/ApiError");


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


module.exports = {
  homeServiceList,
};
