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
const {
  getAdmin,
  patchAdminImage,
  patchAdminFrontDocument,
  patchAdminBackDocument,
  patchAdmin,
  deleteAdmin,
  getAllUsersByAdmin,
} = require("../controllers/admin/admin.controller");
const { getAllLandsByAdmin } = require("../controllers/land.controller");

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

router.get("/users", checkAuthValidation, getAllUsersByAdmin);

router.get("/lands", checkAuthValidation, getAllLandsByAdmin);

router.get(
  "/user/:userId",
  validate(["userId"]),
  validator,
  checkAuthValidation,
  getAdmin
);

router.patch(
  "/:userId/admin-image",
  validate(["userId"]),
  validator,
  checkAuthValidation,
  uploadImages({
    folderName: "GISLandRegistration/userImage",
  }),
  patchAdminImage
);

router.patch(
  "/:userId",
  validate(["userId", "firstName", "lastName", "phoneNumber", "address"]),
  validator,
  checkAuthValidation,
  patchAdmin
);

router.delete(
  "/:userId",
  validate(["userId"]),
  validator,
  checkAuthValidation,
  deleteAdmin
);

module.exports = router;
