const Land = require("../models/land.model");
const { getFuzzySearchPaginatedData } = require("../utils/pagination");
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
    console.log(`Err add lands : ${err}`);
    return res.fail(err);
  }
};

// admin only
exports.getAllLandsByAdmin = async (req, res) => {
  try {
    const { page, limit, search = "", sort } = req.query;
    const lands = await getFuzzySearchPaginatedData({
      model: Land,
      reqQuery: {
        sort,
        page,
        limit,
        pagination: true,
        modFunction: (document) => {
          return document;
        },
      },
      search: search,
      isAdmin: true,
    });

    if (!lands) {
      throw new SetErrorResponse("User not found", 404);
    }

    return res.success({ landData: lands });
  } catch (err) {
    console.log(`Err get lands by admin : ${err}`);
    return res.fail(err);
  }
};
