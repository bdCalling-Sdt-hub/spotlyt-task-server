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
  const service = await Service.findById(req.query.id);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }
  const serviceCategory = await Service.findByIdAndUpdate(
    req.query.id,
    req.body
  );
  res.status(httpStatus.OK).json(
    response({
      message: "Service Category Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: serviceCategory,
    })
  );
});

const deleteService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.query.id);
  res.status(httpStatus.OK).json(
    response({
      message: "Service Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: service,
    })
  );
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

const getOneService = catchAsync(async (req, res) => {
  const service = await Service.findById(req.query.id);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }
  res.status(httpStatus.OK).json(
    response({
      message: "Service",
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


const updateServiceCategory = catchAsync(async (req, res) => {
  const serviceCategory = await ServiceCategory.findByIdAndUpdate(
    req.query.id,
    req.body,
    {
      new: true,
    }
  );
  if (!serviceCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service Category not found");
  }
  res.status(httpStatus.OK).json(
    response({
      message: "Service Category Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: serviceCategory,
    })
  );
});

const getServiceCategoryById = catchAsync(async (req, res) => {
  const serviceCategory = await ServiceCategory.findById(req.query.id);
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
})

const deleteServiceCategory = catchAsync(async (req, res) => {
  const serviceCategory = await ServiceCategory.findByIdAndDelete(req.query.id);
  res.status(httpStatus.OK).json(
    response({
      message: "Service Category Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: serviceCategory,
    })
  );
})

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
  const service = await SingleServiceCategory.find({serviceCategoryId:req.query.serviceCategoryId});
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

const serviceCategoryIdBySingleService = catchAsync(async (req, res) => {
  const service = await SingleServiceCategory.find({serviceCategoryId:req.query.serviceCategoryId})
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service Category not found");
  }
  res.status(httpStatus.OK).json(
    response({
      message: "Service Category",
      status: "OK",
      statusCode: httpStatus.OK,
      data: service,
    })
  );
});

const updateSingleServiceById= catchAsync(async (req, res) => {
  const service = await SingleServiceCategory.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
  });
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }
  res.status(httpStatus.OK).json(
    response({
      message: "Single Service Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: service,
    })
  );
});

const deleteSingleServiceById = catchAsync(async (req, res) => {
  const service = await SingleServiceCategory.findByIdAndDelete(req.query.id);

  res.status(httpStatus.OK).json(
    response({
      message: "Single Service Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: service,
    })
  );
});

const getSingleServiceById = catchAsync(async (req, res) => {
  const service = await SingleServiceCategory.findById(req.query.id);
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

module.exports = {
  getServiceList,
  getOneService,
  CategoryUpdate,
  deleteService,
  addService,
  addServiceCategory,
  updateServiceCategory,
  getServiceCategoryById,
  deleteServiceCategory,
  addSingleService,
  getServiceCategory,
  getSingleService,
  getServiceWithCategoriesAndServices,
  serviceCategoryIdBySingleService,
  updateSingleServiceById,
  getSingleServiceById,
  deleteSingleServiceById
};
