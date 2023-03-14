const {
  createLand,
  getAllLands,
  patchLandByAdmin,
  deleteLand,
  landApprovedByAdmin,
  landRejectedByAdmin,
  getAllLandsByAdmin,
  getAllOwnedLands,
  getIndividualLandById,
} = require("../controllers/land.controller");
const { checkIsAdmin } = require("../middlewares/check.is.admin");
const {
  checkIsUserVerified,
} = require("../middlewares/check.is.user.verified");
const { checkAuthValidation } = require("../middlewares/checkAuthentication");
const { validate } = require("../middlewares/validate");
const { validator } = require("../utils/validator");

const router = require("express").Router({ mergeParams: true });

router.get("/", checkAuthValidation, getAllLands);

router.get("/user-lands", checkAuthValidation, getAllOwnedLands);

router.get("/individual/:id", checkAuthValidation, getIndividualLandById);

router.post(
  "/:id/add-land",
  validate([
    "id",
    "city",
    "area",
    "province",
    "district",
    "wardNo",
    "address",
  ]),
  validator,
  checkAuthValidation,
  checkIsUserVerified,
  createLand
);

//for admin only ----------------------------------------------------------------
router.get("/admin", checkAuthValidation, checkIsAdmin, getAllLandsByAdmin);

router.patch(
  "/admin/:id/edit-land",
  validate(["id"]),
  validator,
  checkAuthValidation,
  checkIsAdmin,
  patchLandByAdmin
);

router.patch(
  "/admin/:id/approve-land",
  validate(["id"]),
  validator,
  checkAuthValidation,
  checkIsAdmin,
  landApprovedByAdmin
);

router.patch(
  "/admin/:id/reject-land",
  validate(["id"]),
  validator,
  checkAuthValidation,
  checkIsAdmin,
  landRejectedByAdmin
);
//------------------------------------------------------------------

router.delete("/:id", checkAuthValidation, deleteLand);

module.exports = router;
