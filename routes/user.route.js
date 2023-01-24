const {
  getUser,
  getAllUsers,
  deleteUser,
  patchUser,
  patchUserImage,
  patchUserBackDocument,
  patchUserFrontDocument,
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
  ]),
  validator,
  checkDuplicateValue(User, [
    { key: "email", value: "body.email" },
    { key: "phoneNumber", value: "body.phoneNumber" },
  ]),
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
  validate(["userId"]),
  validator,
  checkAuthValidation,
  uploadImages({
    folderName: "GISLandRegistration/userImage",
  }),
  patchUserImage
);

router.patch(
  "/:userId/user-front-image",
  validate(["userId"]),
  validator,
  checkAuthValidation,
  uploadImages({
    folderName: "GISLandRegistration/userDocument",
  }),
  patchUserFrontDocument
);

router.patch(
  "/:userId/user-back-image",
  validate(["userId"]),
  validator,
  checkAuthValidation,
  uploadImages({
    folderName: "GISLandRegistration/userDocument",
  }),
  patchUserBackDocument
);

router.patch(
  "/:userId",
  validate(["userId", "firstName", "lastName", "phoneNumber", "address"]),
  validator,
  checkAuthValidation,
  patchUser
);

module.exports = router;
