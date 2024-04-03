const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const taskController = require("../../controllers/tasks.controller");

const router = express.Router();

router.route("/").post(auth("client"), taskController.createTask);
// router.route("/").get(auth("user"), userController.getUsers);

// router
//   .route("/:userId")
//   .get(auth("common"), validate(userValidation.getUser), userController.getUser)
//   .patch(
//     auth("common"),
//     [uploadUsers.single("image")],
//     convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
//     userController.updateUser
//   );

module.exports = router;
