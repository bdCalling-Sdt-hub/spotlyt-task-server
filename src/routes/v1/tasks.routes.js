const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const taskController = require("../../controllers/tasks.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_SUBMIT_TASK = "./public/uploads/submitTask";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_SUBMIT_TASK);
const router = express.Router();

router.route("/service").get(auth("client"), taskController.homeServiceList);
router.route("/admin").get(auth("client"), taskController.getAdminTasks);
router.route("/home").get(auth("employee"), taskController.taskHome);
router
  .route("/register")
  .post(auth("employee"), taskController.taskRegister)
  .patch(
    auth("employee"),
    [uploadUsers.array("image")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_SUBMIT_TASK),
    taskController.taskSubmit
  )
  .get(auth("employee"), taskController.getEmployeeTasks);

router
  .route("/")
  .post(auth("client"), taskController.createTask)
  .get(auth("client"), taskController.getTasks);

router.route("/:taskId").get(auth("common"), taskController.getTask);

module.exports = router;
