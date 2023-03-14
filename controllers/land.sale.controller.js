const mongoose = require("mongoose");
const Land = require("../models/land.model");
const LandSale = require("../models/land.sale.model");
const User = require("../models/user.model");
const { getSearchPaginatedData } = require("../utils/pagination");
const { SetErrorResponse } = require("../utils/responseSetter");

module.exports.addLandForSale = async (req, res) => {
  try {
    const landId = req.params.id;

    const existingLand = await Land.findById({ _id: landId });
    if (existingLand?.ownerUserId != res.locals.authData?._id) {
      throw new SetErrorResponse(
        "Not authorized for current user to add land for sale",
        401
      );
    }
    if (existingLand.isVerified != "approved") {
      throw new SetErrorResponse("land is not verified", 401);
    }

    const newLandSale = new LandSale({
      landId,
      parcelId: existingLand?.parcelId,
      ownerUserId: res.locals.authData?._id,
    });

    await newLandSale.save();

    await Land.findByIdAndUpdate(
      { _id: landId },
      {
        saleData: "selling",
        landSaleId: newLandSale._id,
      },
      { new: true }
    );

    return res.success({ landSaleData: newLandSale }, "Land added for sale");
  } catch (err) {
    console.log(`Error from addLandForSale :: ${err.message}`);
    return res.fail(err);
  }
};

module.exports.getAllLandSale = async (req, res) => {
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
    let populateQuery = [];
    if (search) {
      populateQuery.push({ parcelId: { $regex: search, $options: "i" } });
    }
    if (city) {
      populateQuery.push({ city: { $regex: city, $options: "i" } });
    }
    if (district) {
      populateQuery.push({ district: { $regex: district, $options: "i" } });
    }
    if (province) {
      populateQuery.push({ province: { $regex: province, $options: "i" } });
    }
    populateQuery.push({ isVerified: "approved" });
    query.saleData = "selling";

    console.log(query, populateQuery);

    const landSale = await getSearchPaginatedData({
      model: LandSale,
      reqQuery: {
        query,
        sort,
        page,
        limit,
        populate: {
          path: "requestedUserId landId ownerUserId rejectedUserId approvedUserId prevOwnerUserId",
          match: populateQuery.length != 0 ? { $and: populateQuery } : {},
        },
        pagination: true,
        modFunction: async (document) => {
          // console.log(`document :: ${document}`);
          if (document.landId != null) {
            return document;
          }
        },
      },
    });

    if (!landSale) {
      throw new SetErrorResponse("Land not found", 404);
    }

    return res.success({ landSaleData: landSale });
  } catch (err) {
    console.log(`Error from getAllLandSale :: ${err.message}`);
    return res.fail(err);
  }
};

module.exports.getAllLandSaleByRequestedUserId = async (req, res) => {
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
    let populateQuery = [];
    // if (search) {
    //   populateQuery.push({ parcelId: { $regex: search, $options: "i" } });
    // }
    // if (city) {
    //   populateQuery.push({ city: { $regex: city, $options: "i" } });
    // }
    // if (district) {
    //   populateQuery.push({ district: { $regex: district, $options: "i" } });
    // }
    // if (province) {
    //   populateQuery.push({ province: { $regex: province, $options: "i" } });
    // }
    populateQuery.push({ isVerified: "approved" });
    query.requestedUserId = res.locals.authData?._id;

    console.log(query, populateQuery);

    const landSale = await getSearchPaginatedData({
      model: LandSale,
      reqQuery: {
        query,
        sort,
        page,
        limit,
        populate: {
          path: "requestedUserId landId ownerUserId rejectedUserId approvedUserId prevOwnerUserId",
          match: populateQuery.length != 0 ? { $and: populateQuery } : {},
        },
        pagination: true,
        modFunction: async (document) => {
          // console.log(`document :: ${document}`);
          if (document.landId != null) {
            return document;
          }
        },
      },
    });

    if (!landSale) {
      throw new SetErrorResponse("Land not found", 404);
    }

    return res.success({ landSaleData: landSale });
  } catch (err) {
    console.log(`Error from getAllLandSale :: ${err.message}`);
    return res.fail(err);
  }
};

module.exports.getOwnedLandSale = async (req, res) => {
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
    let populateQuery = [];
    if (search) {
      populateQuery.push({ parcelId: { $regex: search, $options: "i" } });
    }
    if (city) {
      populateQuery.push({ city: { $regex: city, $options: "i" } });
    }
    if (district) {
      populateQuery.push({ district: { $regex: district, $options: "i" } });
    }
    if (province) {
      populateQuery.push({ province: { $regex: province, $options: "i" } });
    }
    populateQuery.push({ isVerified: "approved" });
    // query.saleData = "selling";
    query.ownerUserId = res.locals.authData?._id;

    console.log(query, populateQuery);

    const landSale = await getSearchPaginatedData({
      model: LandSale,
      reqQuery: {
        query,
        sort,
        page,
        limit,
        populate: {
          path: "requestedUserId landId ownerUserId rejectedUserId approvedUserId prevOwnerUserId",
          match: populateQuery.length != 0 ? { $and: populateQuery } : {},
        },
        pagination: true,
        modFunction: async (document) => {
          // console.log(`document :: ${document}`);
          if (document.landId != null) {
            return document;
          }
        },
      },
    });

    if (!landSale) {
      throw new SetErrorResponse("Land not found", 404);
    }

    return res.success({ landSaleData: landSale });
  } catch (err) {
    console.log(`Error from getAllLandSale :: ${err.message}`);
    return res.fail(err);
  }
};

module.exports.getIndividualLandSaleById = async (req, res) => {
  try {
    const landSale = await LandSale.findById({ _id: req.params.id })
      .populate({
        path: "requestedUserId landId ownerUserId rejectedUserId approvedUserId prevOwnerUserId",
        // populate: {
        //   path: "ownerUserId",
        // },
      })
      .lean();

    if (!landSale) {
      throw new SetErrorResponse("Land sale not found", 404);
    }

    return res.success({ landSaleData: landSale });
  } catch (err) {
    console.log(`Error from getIndividualLandSaleById :: ${err.message}`);
    return res.fail(err);
  }
};

module.exports.deleteLandSale = async (req, res) => {
  try {
    const landSaleId = req.params.id;
    const landId = req.params.landId;

    if (!res.locals.authData.isAdmin) {
      const existingLandSale = await LandSale.findById({ _id: landSaleId })
        .populate({ path: "landId" })
        .lean();

      if (existingLandSale?.landId?.ownerUserId != res.locals.authData?._id) {
        throw new SetErrorResponse(
          "Not authorized for current user to delete land for sale",
          401
        );
      }
    }

    const landSale = await LandSale.findByIdAndDelete({
      _id: landSaleId,
    }).lean();

    if (!landSale) {
      throw new SetErrorResponse("Land not found", 404);
    }

    await Land.findOneAndUpdate(
      { _id: landId },
      {
        saleData: "null",
      },
      { new: true }
    );

    return res.success(
      { landSaleData: landSale },
      "Land sale is deleted successfully"
    );
  } catch (err) {
    console.log(`Error from deleteLandSale :: ${err.message}`);
    return res.fail(err);
  }
};

exports.requestToBuyForLandSale = async (req, res) => {
  try {
    const landSaleId = req.params.id;

    const landSale = await LandSale.findById({
      _id: landSaleId,
    }).lean();

    const filterLandSale = landSale?.requestedUserId.find((e) => {
      return e.toString() == res.locals.authData?._id;
    });

    if (res.locals.authData?._id == landSale?.ownerUserId || filterLandSale) {
      throw new SetErrorResponse(
        "User not acceptable to buy their own land or has already been requested",
        401
      );
    }

    let requestedUserIdData = [];

    requestedUserIdData.push(res.locals.authData?._id);

    const updatedLandSale = await LandSale.findByIdAndUpdate(
      { _id: landSaleId },
      {
        requestedUserId: [...landSale.requestedUserId, requestedUserIdData],
      },
      { new: true }
    ).lean();

    return res.success(
      { landSaleData: { updatedLandSale } },
      "Requested buyer for LandSale has been added"
    );
  } catch (err) {
    console.log(`Error from requestToBuyForLandSale :: ${err.message}`);
    return res.fail(err);
  }
};

exports.approveRequestedUserForLandSale = async (req, res) => {
  try {
    const landSaleId = req.params.id;
    const userId = req.params.userId;

    const landSale = await LandSale.findById({
      _id: landSaleId,
    }).lean();
    if (!landSale) {
      throw new SetErrorResponse("Land Sale not found");
    }

    if (res.locals.authData?._id != landSale?.ownerUserId) {
      throw new SetErrorResponse(
        "User not authorized to approve the buyer",
        401
      );
    }

    const filterLandSale = landSale?.requestedUserId.find((e) => {
      return e.toString() == userId;
    });

    if (landSale?.approvedUserId) {
      throw new SetErrorResponse("Some user already accepted!", 401);
    }

    if (!filterLandSale) {
      throw new SetErrorResponse("User not found for approve", 401);
    }

    let requestedUserId = landSale.requestedUserId.filter((e) => {
      return e.toString() != userId;
    });

    const updatedLandSale = await LandSale.findByIdAndUpdate(
      { _id: landSaleId },
      {
        approvedUserId: userId,
        saleData: "processing",
        requestedUserId: [...requestedUserId],
      },
      { new: true }
    ).lean();

    return res.success(
      { landSaleData: { updatedLandSale } },
      "Approved buyer for LandSale"
    );
  } catch (err) {
    console.log(`Error from approveRequestedUserForLandSale :: ${err.message}`);
    return res.fail(err);
  }
};

exports.rejectRequestedUserForLandSale = async (req, res) => {
  try {
    const landSaleId = req.params.id;
    const userId = req.params.userId;

    const landSale = await LandSale.findById({
      _id: landSaleId,
    }).lean();

    if (res.locals.authData?._id != landSale?.ownerUserId) {
      throw new SetErrorResponse(
        "User not authorized to reject the buyer",
        401
      );
    }
    const filterLandSale = landSale?.requestedUserId?.find((e) => {
      return e.toString() == userId;
    });

    if (!filterLandSale) {
      throw new SetErrorResponse("User not found for reject", 401);
    }

    let requestedUserId = landSale.requestedUserId.filter((e) => {
      return e.toString() != userId;
    });

    let rejectedUserId = [];
    rejectedUserId.push(userId);

    const updatedLandSale = await LandSale.findByIdAndUpdate(
      { _id: landSaleId },
      {
        requestedUserId: [...requestedUserId],
        rejectedUserId: [...landSale.rejectedUserId, ...rejectedUserId],
      },
      { new: true }
    ).lean();

    return res.success(
      { landSaleData: { updatedLandSale } },
      "Rejected buyer for LandSale"
    );
  } catch (err) {
    console.log(`Error from rejectRequestedUserForLandSale :: ${err.message}`);
    return res.fail(err);
  }
};
