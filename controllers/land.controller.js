const Land = require("../models/land.model");
const User = require("../models/user.model");
const { SetErrorResponse } = require("../utils/responseSetter");

exports.createLand = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      city,
      area,
      parcelId,
      streetNo,
      wardNo,
      province,
      district,
      latitude,
      longitude,
    } = req.body;

    const newLand = new Land({
      city,
      area,
      parcelId,
      streetNo,
      wardNo,
      province,
      district,
      latitude,
      longitude,
      ownerUser: userId,
    });

    await newLand.save();

    // const existingUser = await User.findById({ _id: userId }).lean();

    // if (!existingUser) {
    //   throw new SetErrorResponse("User not found", 404);
    // }

    // const user = await User.findByIdAndUpdate(
    //   { _id: userId },
    //   { ownedLand: [...existingUser.ownedLand, newLand] },
    //   { new: true }
    // ).lean();

    // console.log(user);

    return res.success({ landData: newLand }, "land created successfully");
  } catch (err) {
    console.log(err);
    return res.fail(err);
  }
};
