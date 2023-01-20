const router = require("express").Router({ mergeParams: true });

const userRouter = require("./user.route");

router.use("/admin", userRouter);
router.use("/user", userRouter);

module.exports = router;
