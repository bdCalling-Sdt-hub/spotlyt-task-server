const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const {
  Service,
  ServiceCategory,
  SingleServiceCategory,
} = require("../models");
const ApiError = require("../utils/ApiError");

const getServiceList = catchAsync(async (req, res) => {
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

const CategoryUpdate = catchAsync(async (req, res) => {
  try {
    const { serviceId, categoryId, serviceIndex, property } = req.query;
    const updatedValue = req.body.value;

    let service = await Service.findById(serviceId);

    const categoryIndex = service.Categories.findIndex(
      (cat) => cat.id === categoryId
    );
    if (categoryIndex !== -1) {
      const category = service.Categories[categoryIndex];
      if (category.service.length > serviceIndex) {
        const serviceToUpdate = category.service[serviceIndex];
        if (serviceToUpdate.hasOwnProperty(property)) {
          serviceToUpdate[property] = updatedValue;
          await service.save();
          res.json(service);
        } else {
          res.status(404).json({ message: "Property not found" });
        }
      } else {
        res.status(404).json({ message: "Service not found" });
      }
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const addService = catchAsync(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Service Added",
      status: "OK",
      statusCode: httpStatus.OK,
      data: service,
    })
  );
});

const addServiceCategory = catchAsync(async (req, res) => {
  const service = await Service.findById(req.body.serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }
  const serviceCategory = await ServiceCategory.create(req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Service Category Added",
      status: "OK",
      statusCode: httpStatus.OK,
      data: serviceCategory,
    })
  );
});

const getServiceCategory = catchAsync(async (req, res) => {
  const serviceCategory = await ServiceCategory.find({});
  if (!serviceCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service Category not found");
  }
  res.status(httpStatus.OK).json(
    response({
      message: "Service Category",
      status: "OK",
      statusCode: httpStatus.OK,
      data: serviceCategory,
    })
  );
});

const addSingleService = catchAsync(async (req, res) => {
  const serviceCategory = await ServiceCategory.findById(
    req.body.serviceCategoryId
  );
  if (!serviceCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service Category not found");
  }
  const service = await SingleServiceCategory.create(req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Single Service Added",
      status: "OK",
      statusCode: httpStatus.OK,
      data: service,
    })
  );
});

const getSingleService = catchAsync(async (req, res) => {
  const service = await SingleServiceCategory.find({});
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }
  res.status(httpStatus.OK).json(
    response({
      message: "Single Service",
      status: "OK",
      statusCode: httpStatus.OK,
      data: service,
    })
  );
});

const getServiceWithCategoriesAndServices = catchAsync(async (req, res) => {
    try {
        const result = await Service.aggregate([
          {
            $lookup: {
              from: 'servicecategories', // collection name
              localField: '_id',
              foreignField: 'serviceId',
              as: 'Categories',
            },
          },
          {
            $unwind: {
              path: '$Categories',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'singleservicecategories', // collection name
              localField: 'Categories._id',
              foreignField: 'serviceCategoryId',
              as: 'Categories.service',
            },
          },
          {
            $group: {
              _id: '$_id',
              name: { $first: '$name' },
              type: { $first: '$type' },
              description: { $first: '$description' },
              Categories: { $push: '$Categories' },
            },
          },
          {
            $project: {
              id: 1,
              name: 1,
              type: 1,
              description: 1,
              Categories: {
                $map: {
                  input: '$Categories',
                  as: 'category',
                  in: {
                    id: '$$category._id',
                    name: '$$category.name',
                    service: '$$category.service',
                  },
                },
              },
              __v: 1,
            },
          },
        ]);
    
        res.status(httpStatus.OK).json(
          response({
            message: 'Service with Categories and Services',
            status: 'OK',
            statusCode: httpStatus.OK,
            data: result,
          })
        );
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      }
});

module.exports = {
  getServiceList,
  CategoryUpdate,
  addService,
  addServiceCategory,
  addSingleService,
  getServiceCategory,
  getSingleService,
  getServiceWithCategoriesAndServices
};
