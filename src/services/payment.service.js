const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const { userService } = require("./user.service");
const { Payment } = require("../models");
const createPayment  = async (bodyData) => {
  const payment = await Payment.create(bodyData);
  return payment;
};

module.exports = {
    createPayment ,
};
