const router = require("express").Router({ mergeParams: true });

const userRouter = require("./user.route");
const adminRouter = require("./admin.route");
const landRouter = require("./land.route");
const landSaleRouter = require("./land.sale.route");

router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/land", landRouter);
// router.use("/land-sale", landSaleRouter);

module.exports = router;


