const {
  createLand,
  getAllLands,
  patchLandByAdmin,
  deleteLand,
} = require("../controllers/land.controller");
const { checkAuthValidation } = require("../middlewares/checkAuthentication");
const { validate } = require("../middlewares/validate");
const { validator } = require("../utils/validator");

const router = require("express").Router({ mergeParams: true });

router.get("/", checkAuthValidation, getAllLands);

router.post(
  "/:id/add-land",
  validate([
    "id",
    "city",
    "area",
    "province",
    "district",
    "latitude",
    "longitude",
    "wardNo",
    "address",
  ]),
  validator,
  checkAuthValidation,
  createLand
);

router.patch("/:id/edit-land", checkAuthValidation, patchLandByAdmin);

router.delete("/:id", checkAuthValidation, deleteLand);

module.exports = router;
