const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const taskController = require("../../controllers/tasks.controller");

const router = express.Router();

router.route("/service").get(auth("client"), taskController.homeServiceList);
router.route("/admin").get(auth("client"), taskController.getAdminTasks);
router.route("/home").get(auth("employee"), taskController.taskHome);
router
  .route("/")
  .post(auth("client"), taskController.createTask)
  .get(auth("client"), taskController.getTasks);

router.route("/:taskId").get(auth("common"), taskController.getTask);

module.exports = router;
