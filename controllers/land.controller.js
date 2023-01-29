const Land = require("../models/land.model");
const { getFuzzySearchPaginatedData } = require("../utils/pagination");
const { SetErrorResponse } = require("../utils/responseSetter");

exports.createLand = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      city,
      area,
      parcelId,
      address,
      surveyNo,
      landPrice,
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
      address,
      wardNo,
      province,
      district,
      latitude,
      longitude,
      landPrice,
      ownerUserId: userId,
      surveyNo,
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

exports.getAllLands = async (req, res) => {
  try {
    const {
      page,
      limit,
      search = "",
      sort,
      city,
      district,
      province,
    } = req?.query;
    let query = {};
    if (city) {
      query.city = { $regex: city, $options: "i" };
    }
    if (district) {
      query.district = { $regex: district, $options: "i" };
    }
    if (province) {
      query.province = { $regex: province, $options: "i" };
    }
    query.isVerified = "approved";
    console.log(query);

    const lands = await getFuzzySearchPaginatedData({
      model: Land,
      reqQuery: {
        sort,
        page,
        limit,
        query,
        pagination: true,
        modFunction: (document) => {
          return document;
        },
      },
      search: search,
    });

    if (!lands) {
      throw new SetErrorResponse("Land not found", 404);
    }
    return res.success({ landData: lands });
  } catch (err) {
    console.log(`Err get lands by admin : ${err}`);
    return res.fail(err);
  }
};

exports.deleteLand = async (req, res) => {
  try {
    const landId = req.params.id;
    const land = await Land.findByIdAndDelete({ _id: landId });
    if (!land) {
      throw new SetErrorResponse("Land not found"); // default (Not found,404)
    }
    return res.success({ landData: land }, "Land Deleted ");
  } catch (err) {
    return res.fail(err);
  }
};

// only for admin ------------------------------------
exports.patchLandByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      city,
      area,
      parcelId,
      address,
      surveyNo,
      landPrice,
      wardNo,
      province,
      district,
      latitude,
      longitude,
    } = req.body;

    const land = await Land.findByIdAndUpdate(
      { _id: userId },
      {
        city,
        area,
        parcelId,
        address,
        wardNo,
        province,
        district,
        latitude,
        longitude,
        landPrice,
        ownerUserId: userId,
        surveyNo,
      },
      { new: true }
    ).lean();

    if (!land) {
      throw new SetErrorResponse("Land not found", 404);
    }

    return res.success({ landData: land }, "Land updated");
  } catch (err) {
    return res.fail(err);
  }
};

exports.getAllLandsByAdmin = async (req, res) => {
  try {
    const {
      page,
      limit,
      search = "",
      sort,
      city,
      district,
      province,
    } = req?.query;
    let query = {};
    if (city) {
      query.city = { $regex: city, $options: "i" };
    }
    if (district) {
      query.district = { $regex: district, $options: "i" };
    }
    if (province) {
      query.province = { $regex: province, $options: "i" };
    }
    console.log(query);

    const lands = await getFuzzySearchPaginatedData({
      model: Land,
      reqQuery: {
        sort,
        page,
        limit,
        query,
        pagination: true,
        modFunction: (document) => {
          return document;
        },
      },
      search: search,
    });

    if (!lands) {
      throw new SetErrorResponse("Land not found", 404);
    }
    return res.success({ landData: lands });
  } catch (err) {
    console.log(`Err get lands by admin : ${err}`);
    return res.fail(err);
  }
};
