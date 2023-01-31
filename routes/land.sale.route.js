const {
  addLandForSale,
  getAllLandSale,
  deleteLandSale,
} = require("../controllers/land.sale.controller");
const { checkAuthValidation } = require("../middlewares/checkAuthentication");
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

router.get(
  "/",
  checkAuthValidation,
  getAllLandSale
);

router.delete(
  "/:id",
  validate(["id"]),
  validator,
  checkAuthValidation,
  deleteLandSale
);

module.exports = router;
