const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const serviceController = require("../../controllers/service.controller");

const router = express.Router();


router.route("/").get( serviceController.getServiceWithCategoriesAndServices);
router.route("/").put( serviceController.CategoryUpdate);
router.route("/").delete( serviceController.deleteService);
router.route("/").post( serviceController.addService);
router.route("/category").post( serviceController.addServiceCategory)
router.route("/category").get(serviceController.getServiceCategory)
router.route("/category").delete(serviceController.deleteServiceCategory)
router.route("/category").put(serviceController.updateServiceCategory)
router.route("/category/one").get(serviceController.getServiceCategoryById)
router.route("/category/single").post( serviceController.addSingleService)
router.route("/category/single").get( serviceController.getSingleService)
router.route("/category/single").put( serviceController.updateSingleServiceById)
router.route("/category/single").delete( serviceController.deleteSingleServiceById)
router.route("/category/single/one").get( serviceController.getSingleServiceById)

module.exports = router;
