const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const serviceController = require("../../controllers/service.controller");

const router = express.Router();


router.route("/").get( serviceController.getServiceWithCategoriesAndServices);
router.route("/").put( serviceController.CategoryUpdate);
router.route("/").post( serviceController.addService);
router.route("/category").post( serviceController.addServiceCategory)
router.route("/category").get(serviceController.getServiceCategory)
router.route("/category/single").post( serviceController.addSingleService)
router.route("/category/single").get( serviceController.getSingleService)

// router.route("/").post( referralController.createService);
// router
//     .route("/:serviceId")
//     .get( referralController.getService)
//     .patch( referralController.updateService)
//     .delete( referralController.deleteService);

module.exports = router;
