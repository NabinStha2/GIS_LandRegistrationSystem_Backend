const Land = require("../models/land.model");
const User = require("../models/user.model");
const { getSearchPaginatedData } = require("../utils/pagination");
const { SetErrorResponse } = require("../utils/responseSetter");

exports.createLand = async (req, res) => {
  try {
    const userId = res.locals.authData?._id;

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
      polygon,
    } = req.body;

    const newLand = new Land({
      city,
      area,
      parcelId,
      address,
      wardNo,
      province,
      district,
      polygon,
      landPrice,
      ownerUserId: userId,
      surveyNo,
    });

    await newLand.save();

    const existingUser = await User.findById({ _id: userId }).lean();

    if (!existingUser) {
      throw new SetErrorResponse("User not found", 404);
    }

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { ownedLand: [...existingUser.ownedLand, newLand] },
      { new: true }
    ).lean();

    // console.log(user);

    return res.success({ landData: newLand }, "land created successfully");
  } catch (err) {
    console.log(`Err add lands : ${err}`);
    return res.fail(err);
  }
};

module.exports.getIndividualLandById = async (req, res) => {
  try {
    const land = await Land.findById({ _id: req.params.id })
      .populate({ path: "ownerUserId" })
      .lean();

    if (!land) {
      throw new SetErrorResponse("Land not found", 404);
    }

    return res.success({ landData: land });
  } catch (err) {
    console.log(`Error from getIndividualLandById :: ${err.message}`);
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
    if (search) {
      query.parcelId = { $regex: search, $options: "i" };
    }
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

    const lands = await getSearchPaginatedData({
      model: Land,
      reqQuery: {
        sort,
        page,
        limit,
        query,
        populate: {
          path: "ownerUserId",
          select: "-frontCitizenshipFile -backCitizenshipFile -ownedLand",
        },
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
    console.log(`Err get all lands : ${err}`);
    return res.fail(err);
  }
};

exports.getAllOwnedLands = async (req, res) => {
  try {
    const userId = res.locals.authData?._id;
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
    if (search) {
      query.parcelId = { $regex: search, $options: "i" };
    }
    // if (city) {
    //   query.city = { $regex: city, $options: "i" };
    // }
    // if (district) {
    //   query.district = { $regex: district, $options: "i" };
    // }
    // if (province) {
    //   query.province = { $regex: province, $options: "i" };
    // }
    // query.isVerified = "approved";
    console.log(`limit: ${limit} :: page: ${page}`);

    query.ownerUserId = userId;

    const lands = await getSearchPaginatedData({
      model: Land,
      reqQuery: {
        sort,
        page,
        limit,
        query,
        populate: {
          path: "ownerUserId",
          select: "-frontCitizenshipFile -backCitizenshipFile -ownedLand",
        },
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
    console.log(`Err get owned lands : ${err}`);
    return res.fail(err);
  }
};

exports.deleteLand = async (req, res) => {
  try {
    const landId = req.params.id;

    if (!res.locals.authData.isAdmin) {
      const existingLand = await Land.findById({ _id: landId }).lean();

      if (existingLand?.ownerUserId != res.locals.authData?._id) {
        throw new SetErrorResponse(
          "Not authorized for current user to delete land",
          401
        );
      }
    }

    const land = await Land.findByIdAndDelete({ _id: landId });
    if (!land) {
      throw new SetErrorResponse("Land not found"); // default (Not found,404)
    }

    const existingUser = await User.findById({
      _id: res.locals.authData?._id,
    }).lean();

    var filteredData;
    if (existingUser) {
      filteredData = existingUser.ownedLand.filter((e) => e != landId);
      // console.log(filteredData);
      const updatedUser = await User.findByIdAndUpdate(
        {
          _id: res.locals.authData?._id,
        },
        { ownedLand: filteredData },
        {
          new: true,
        }
      );
      console.log(updatedUser);
    }
    return res.success({ landData: land }, "Land Deleted ");
  } catch (err) {
    console.log(`Err from delete lands : ${err}`);
    return res.fail(err);
  }
};

// only for admin ------------------------------------
exports.landApprovedByAdmin = async (req, res) => {
  try {
    const landId = req.params?.id;
    const land = await Land.findByIdAndUpdate(
      { _id: landId },
      {
        isVerified: "approved",
      },
      { new: true }
    ).lean();

    return res.success({ landData: land }, "Land approved successfully");
  } catch (err) {
    return res.fail(err);
  }
};

exports.landRejectedByAdmin = async (req, res) => {
  try {
    const landId = req.params?.id;

    const existingLand = await Land.findById({ _id: landId }).lean();
    if (existingLand?.isVerified == "approved") {
      throw new SetErrorResponse(
        "Already approved!,so cannot reject the land",
        400
      );
    }
    const land = await Land.findByIdAndUpdate(
      { _id: landId },
      {
        isVerified: "rejected",
      },
      { new: true }
    ).lean();

    return res.success({ landData: land }, "Land rejected successfully");
  } catch (err) {
    return res.fail(err);
  }
};

exports.patchLandByAdmin = async (req, res) => {
  try {
    const landId = req.params?.id;
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

    const existingLand = await Land.findById({ _id: landId }).lean();

    console.log(parcelId, existingLand?.area);

    const land = await Land.findByIdAndUpdate(
      { _id: landId },
      {
        city: city || existingLand.city,
        area: area || existingLand.area,
        parcelId: parcelId || existingLand?.parcelId,
        address: address || existingLand.address,
        wardNo: wardNo || existingLand.wardNo,
        province: province || existingLand.province,
        district: district || existingLand?.district,
        latitude: latitude || existingLand.latitude,
        longitude: longitude || existingLand.longitude,
        landPrice: landPrice || existingLand.landPrice,
        surveyNo: surveyNo || existingLand.surveyNo,
      },
      { new: true }
    ).lean();

    if (!land) {
      throw new SetErrorResponse("Land not found", 404);
    }

    return res.success({ landData: land }, "Land updated");
  } catch (err) {
    console.log(`Err :: ${err.message}`);
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
    if (search) {
      query.parcelId = { $regex: search, $options: "i" };
    }
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

    const lands = await getSearchPaginatedData({
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
