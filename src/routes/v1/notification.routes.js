const express = require("express");
const auth = require("../../middlewares/auth");
const notificationController = require("../../controllers/notification.controller");

const router = express.Router();

router.route("/").get(notificationController.getALLNotification);

router
  .route("/:id")
  .patch(notificationController.readNotification)
  .delete(notificationController.deleteNotificationById);
router.route("/admin").get(notificationController.getALLNotificationAdmin);

module.exports = router;
