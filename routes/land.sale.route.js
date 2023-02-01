const {
  addLandForSale,
  getAllLandSale,
  deleteLandSale,
  requestToBuyForLandSale,
  approveRequestedUserForLandSale,
  rejectRequestedUserForLandSale,
} = require("../controllers/land.sale.controller");
const { checkAuthValidation } = require("../middlewares/checkAuthentication");
const {
  checkIsUserVerified,
} = require("../middlewares/check.is.user.verified");
const { validate } = require("../middlewares/validate");
const { validator } = require("../utils/validator");

const router = require("express").Router();

router.post(
  "/:id",
  validate(["id"]),
  validator,
  checkAuthValidation,
  addLandForSale
);

router.get("/", checkAuthValidation, getAllLandSale);

router.delete(
  "/:id",
  validate(["id"]),
  validator,
  checkAuthValidation,
  deleteLandSale
);

router.patch(
  "/request-land-buy/:id",
  validate(["id"]),
  validator,
  checkAuthValidation,
  checkIsUserVerified,
  requestToBuyForLandSale
);

router.patch(
  "/:id/approve-land-buyer/:userId",
  validate(["id"]),
  validator,
  checkAuthValidation,
  checkIsUserVerified,
  approveRequestedUserForLandSale
);

router.patch(
  "/:id/reject-land-buyer/:userId",
  validate(["id"]),
  validator,
  checkAuthValidation,
  checkIsUserVerified,
  rejectRequestedUserForLandSale
);

module.exports = router;
