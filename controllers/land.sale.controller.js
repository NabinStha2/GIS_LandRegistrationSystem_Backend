const Land = require("../models/land.model");
const LandSale = require("../models/land.sale.model");
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

    return res.success({ landSaleData: newLandSale }, "Land added for sale");
  } catch (err) {
    console.log(`Err :: ${err.message}`);
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
    let query = [];
    if (search) {
      query.push({ parcelId: { $regex: search, $options: "i" } });
    }
    if (city) {
      query.push({ city: { $regex: city, $options: "i" } });
    }
    if (district) {
      query.push({ district: { $regex: district, $options: "i" } });
    }
    if (province) {
      query.push({ province: { $regex: province, $options: "i" } });
    }
    query.push({ isVerified: "approved" });
    console.log(query);

    const landSale = await getSearchPaginatedData({
      model: LandSale,
      reqQuery: {
        sort,
        page,
        limit,
        populate: {
          path: "landId",
          match: query.length != 0 ? { $and: query } : {},
        },
        pagination: true,
        modFunction: async (document) => {
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
    console.log(`Err :: ${err.message}`);
    return res.fail(err);
  }
};

module.exports.deleteLandSale = async (req, res) => {
  try {
    const landSaleId = req.params.id;

    const landSale = await LandSale.findByIdAndDelete({
      _id: landSaleId,
    }).lean();

    if (!landSale) {
      throw new SetErrorResponse("Land not found", 404);
    }

    return res.success(
      { landSaleData: landSale },
      "Land sale is deleted successfully"
    );
  } catch (err) {
    console.log(`Err :: ${err.message}`);
    return res.fail(err);
  }
};
