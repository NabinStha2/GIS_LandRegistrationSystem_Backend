const { createLand } = require("../controllers/land.controller");
const { checkAuthValidation } = require("../middlewares/checkAuthentication");
const { validate } = require("../middlewares/validate");
const { validator } = require("../utils/validator");

const router = require("express").Router({ mergeParams: true });

router.post(
  "/:userId/add-land",
  validate([
    "userId",
    "city",
    "area",
    "province",
    "district",
    "latitude",
    "longitude",
    "wardNo",
    "streetNo",
  ]),
  validator,
  checkAuthValidation,
  createLand
);

module.exports = router;
