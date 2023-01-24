const router = require("express").Router({ mergeParams: true });

const userRouter = require("./user.route");
const adminRouter = require("./admin.route");

router.use("/admin", adminRouter);
router.use("/user", userRouter);

module.exports = router;
