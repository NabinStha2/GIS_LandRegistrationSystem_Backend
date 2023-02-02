const Land = require("../models/land.model");
const LandSale = require("../models/land.sale.model");
const TransferOwnership = require("../models/transfer.ownership.model");
const { getSearchPaginatedData } = require("../utils/pagination");
const { SetErrorResponse } = require("../utils/responseSetter");

module.exports.getAllLandForTransferOwnership = async (req, res) => {
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
    console.log(query);

    const transferOwnership = await getSearchPaginatedData({
      model: TransferOwnership,
      reqQuery: {
        sort,
        page,
        limit,
        populate: {
          path: "landSaleId",
          populate: {
            path: "landId ownerUserId",
            match: query.length != 0 ? { $and: query } : {},
          },
        },
        pagination: true,
        modFunction: async (document) => {
          //   console.log(`document :: ${document}`);
          if (document.landSaleId.landId != null) {
            return document;
          }
        },
      },
    });

    console.log(transferOwnership);

    if (!transferOwnership) {
      throw new SetErrorResponse("TransferOwnership not found", 404);
    }

    return res.success({ transferOwnershipData: transferOwnership });
  } catch (err) {
    console.log(`Error from getAllLandForTransferOwnership : ${err}`);
    return res.fail(err);
  }
};

module.exports.addLandForTransferOwnership = async (req, res) => {
  try {
    const landSaleId = req.params.id;
    const landSale = await LandSale.findById({ _id: landSaleId })
      .populate({ path: "landId ownerUserId" })
      .lean();

    console.log(landSale);

    if (!landSale) {
      throw new SetErrorResponse("LandSale not found", 404);
    }
    if (landSale?.ownerUserId._id != res.locals.authData?._id) {
      throw new SetErrorResponse(
        "User have no permission to add land for transfer",
        401
      );
    }

    const newTransfer = new TransferOwnership({
      landSaleId,
      ownerUserId: res.locals.authData?._id,
      approvedUserId: landSale?.approvedUserId,
    });

    await newTransfer.save();

    return res.success(
      { transferOwnershipData: newTransfer },
      "Land added for transfer"
    );
  } catch (err) {
    console.log(`Error from addLandForTransferOwnership : ${err}`);
    return res.fail(err);
  }
};

module.exports.approveLandForTransferOwnership = async (req, res) => {
  try {
    const transferOwnershipId = req.params.id;
    console.log(transferOwnershipId);
    const transferOwnership = await TransferOwnership.findById({
      _id: transferOwnershipId,
    })
      .populate({
        path: "landSaleId",
        populate: {
          path: "landId ownerUserId",
        },
      })
      .lean();

    if (!transferOwnership) {
      throw new SetErrorResponse("TransferOwnership not found", 404);
    }
    // if (transferOwnership?.ownerUserId._id != res.locals.authData?._id) {
    //   throw new SetErrorResponse(
    //     "User have no permission to approve land for transfer",
    //     401
    //   );
    // }

    let ownerHistory = [];
    ownerHistory.push(res.locals.authData?._id);

    const [updatedLand, updatedLandSale, updatedTransferOwnership] =
      await Promise.all([
        Land.findByIdAndUpdate(
          { _id: transferOwnership?.landSaleId?.landId?._id },
          {
            ownerUserId: transferOwnership?.approvedUserId,
            ownerHistory: [...ownerHistory],
          },
          { new: true }
        ).lean(),
        LandSale.findByIdAndUpdate(
          { _id: transferOwnership?.landSaleId?._id },
          {
            ownerUserId: transferOwnership?.approvedUserId,
            prevOwnerUserId: res.locals.authData?._id,
            saleData: "selled",
          },
          { new: true }
        ).lean(),
        TransferOwnership.findByIdAndUpdate(
          {
            _id: transferOwnershipId,
          },
          {
            ownerUserId: transferOwnership?.approvedUserId,
          },
          { new: true }
        ).lean(),
      ]);

    // const updatedLand = await Land.findByIdAndUpdate(
    //   { _id: transferOwnership?.landSaleId?.landId },
    //   {
    //     ownerUserId: transferOwnership?.approvedUserId,
    //     ownerHistory: [...res.locals.authData?._id],
    //   },
    //   { new: true }
    // ).lean();

    console.log(`updatedLand : ${updatedLand}`);
    // console.log(updatedLandSale);
    // console.log(updatedTransferOwnership);

    // const updatedLandSale = await LandSale.findByIdAndUpdate(
    //   { _id: transferOwnership?.landSaleId },
    //   {
    //     ownerUserId: transferOwnership?.approvedUserId,
    //     prevOwnerUserId: res.locals.authData?._id,
    //     saleData: "selled",
    //   },
    //   { new: true }
    // ).lean();

    // const updatedTranferOwnership = await TransferOwnership.findByIdAndUpdate(
    //   {
    //     _id: transferOwnershipId,
    //   },
    //   {
    //     ownerUserId: transferOwnership?.approvedUserId,
    //   },
    //   { new: true }
    // ).lean();

    return res.success(
      { transferOwnershipData: updatedTransferOwnership },
      "Land added for transfer"
    );
  } catch (err) {
    console.log(`Error from approveLandForTransferOwnership : ${err}`);
    return res.fail(err);
  }
};
