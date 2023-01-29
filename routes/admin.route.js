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
const { checkIsAdmin } = require("../middlewares/check.is.admin");

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

router.get("/users", checkAuthValidation, checkIsAdmin, getAllUsersByAdmin);

router.get(
  "/user/:id",
  validate(["id"]),
  validator,
  checkAuthValidation,
  checkIsAdmin,
  getAdmin
);

router.patch(
  "/:id/admin-image",
  validate(["id"]),
  validator,
  checkAuthValidation,
  checkIsAdmin,
  uploadImages({
    folderName: "GISLandRegistration/userImage",
  }),
  patchAdminImage
);

router.patch(
  "/:id",
  validate(["id", "firstName", "lastName", "phoneNumber", "address"]),
  validator,
  checkAuthValidation,
  checkIsAdmin,
  patchAdmin
);

router.delete(
  "/:id",
  validate(["id"]),
  validator,
  checkAuthValidation,
  checkIsAdmin,
  deleteAdmin
);

module.exports = router;
