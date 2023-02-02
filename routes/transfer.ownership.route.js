const { checkAuthValidation } = require("../middlewares/checkAuthentication");
const { validate } = require("../middlewares/validate");
const { validator } = require("../utils/validator");
const {
  addLandForTransferOwnership,
  approveLandForTransferOwnership,
  getAllLandForTransferOwnership,
} = require("../controllers/transfer.ownership.controller");

const router = require("express").Router();

router.get("/", checkAuthValidation, getAllLandForTransferOwnership);

router.post(
  "/:id",
  validate(["id"]),
  validator,
  checkAuthValidation,
  addLandForTransferOwnership
);

router.patch(
  "/:id",
  validate(["id"]),
  validator,
  checkAuthValidation,
  approveLandForTransferOwnership
);

module.exports = router;
