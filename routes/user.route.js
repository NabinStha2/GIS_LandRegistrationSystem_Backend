const {
  getUser,
  getAllUsers,
  deleteUser,
  patchUser,
  patchUserImage,
} = require("../controllers/user.controller");
const {
  userRegisterController,
  userVerifyOTPAndRegisterController,
  userloginController,
} = require("../controllers/userAuth.contoller");
const { checkAuthValidation } = require("../middlewares/checkAuthentication");
const { checkDuplicateValue } = require("../middlewares/duplicateValueChecker");
const { uploadImages } = require("../middlewares/multer");
const { validate } = require("../middlewares/validate");
const User = require("../models/user.model");
const { validator } = require("../utils/validator");

const router = require("express").Router();

router.post(
  "/register",
  validate([
    "email",
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "password",
    "otp",
  ]),
  validator,
  checkDuplicateValue(User, [{ key: "email", value: "body.email" }]),
  userRegisterController
);

router.post(
  "/register/otp/verify",
  validate(["email", "OTP"]),
  validator,
  userVerifyOTPAndRegisterController
);

router.post(
  "/login",
  validate(["email", "password"]),
  validator,
  userloginController
);

router.get(
  "/:userId",
  validate(["userId"]),
  validator,
  checkAuthValidation,
  getUser
);

router.get("/", checkAuthValidation, getAllUsers);

router.patch(
  "/:userId/user-image",
  uploadImages({
    singleName: "userImage",
    folderName: "GISLandRegistration/userImage",
  }),
  validate(["userId"]),
  validator,
  checkAuthValidation,
  patchUserImage
);

router.patch(
  "/:userId",
  validate(["userId", "firstName", "lastName", "phoneNumber", "address"]),
  validator,
  checkAuthValidation,
  patchUser
);

router.delete(
  "/:userId",
  validate(["userId"]),
  validator,
  checkAuthValidation,
  deleteUser
);

module.exports = router;
