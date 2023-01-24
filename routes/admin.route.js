const {
  getUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/user.controller");
const {
  adminRegisterController,
  adminVerifyOTPAndRegisterController,
  adminloginController,
} = require("../controllers/admin/adminAuth.controller");
const { checkAuthValidation } = require("../middlewares/checkAuthentication");
const { checkDuplicateValue } = require("../middlewares/duplicateValueChecker");
const { uploadImages } = require("../middlewares/multer");
const { validate } = require("../middlewares/validate");
const { validator } = require("../utils/validator");
const Admin = require("../models/admin.model");
const { checkExistance } = require("../middlewares/checkExistance");

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
  checkDuplicateValue(Admin, [{ key: "email", value: "body.email" }]),
  adminRegisterController
);

router.post(
  "/register/otp/verify",
  validate(["email", "OTP"]),
  validator,
  adminVerifyOTPAndRegisterController
);

router.post(
  "/login",
  validate(["email", "password"]),
  validator,
  checkExistance(Admin, [
    {
      key: "email",
      value: "body.email",
    },
  ]),
  adminloginController
);

router.get(
  "/:userId",
  validate(["userId"]),
  validator,
  checkAuthValidation,
  getUser
);

router.get("/", checkAuthValidation, getAllUsers);

router.delete(
  "/:userId",
  validate(["userId"]),
  validator,
  checkAuthValidation,
  deleteUser
);

module.exports = router;
