const User = require("../models/user.model");
const {
  deleteFileLocal,
  deleteFileCloudinary,
} = require("../utils/fileHandling");
const { getFuzzySearchPaginatedData } = require("../utils/pagination");
const { SetErrorResponse } = require("../utils/responseSetter");

exports.getUser = async (req, res) => {
  try {
    const userId = req.params?.userId;
    const existingUser = await User.findById({ _id: userId }).lean();

    console.log(existingUser);

    if (
      !existingUser ||
      existingUser.isVerified == "pending" ||
      existingUser.isVerified == "rejected"
    ) {
      throw new SetErrorResponse("User not found", 404);
    }

    return res.success({ userData: existingUser });
  } catch (err) {
    return res.fail(err);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page, limit, search = "", sort } = req.query;
    const users = await getFuzzySearchPaginatedData(
      User,
      {
        sort,
        page,
        limit,
        pagination: true,
        modFunction: (document) => {
          return document;
        },
      },
      search
    );

    if (!users) {
      throw new SetErrorResponse("User not found", 404);
    }

    return res.success({ userData: users });
  } catch (err) {
    return res.fail(err);
  }
};

exports.patchUserImage = async (req, res) => {
  try {
    const userId = res.locals.authData?._id;
    const userImageLocation =
      req.files?.userImage?.length > 0
        ? req.files.userImage[0]?.location
        : undefined;

    const editUserImageQuery = {};

    if (userImageLocation) {
      editUserImageQuery.imageFile = {};
      editUserImageQuery.imageFile.imageUrl = userImageLocation;
      editUserImageQuery.imageFile.imagePublicId =
        req.files?.userImage[0]?.publicId;
    }

    User.findById({ _id: userId })
      .lean()
      .then(async (res) => {
        console.log(res.imageFile?.imagePublicId);
        if (userImageLocation && res.imageFile?.imagePublicId) {
          await deleteFileCloudinary(res.imageFile?.imagePublicId);
        }
      })
      .catch((err) => {
        throw new SetErrorResponse("Error deleting file cloudinary", 500);
      });

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        ...editUserImageQuery,
      },
      { new: true }
    ).lean();

    if (userImageLocation && user?.imageFile?.imageUrl) {
      deleteFileLocal({ imagePath: req.files.userImage[0]?.path });
    }

    if (
      !user ||
      user.isVerified == "pending" ||
      user.isVerified == "rejected"
    ) {
      throw new SetErrorResponse("User not found"); // default (Not found,404)
    }

    return res.success({ userData: user }, "Success");
  } catch (err) {
    return res.fail(err);
  }
};

exports.patchUserFrontDocument = async (req, res) => {
  try {
    const userId = res.locals.authData?._id;
    const frontCitizenshipImageLocation =
      req.files?.frontCitizenshipImage?.length > 0
        ? req.files.frontCitizenshipImage[0]?.location
        : undefined;

    if (frontCitizenshipImageLocation) {
      editFrontQuery = {
        frontCitizenshipFile: {},
      };
      editFrontQuery.frontCitizenshipFile.frontCitizenshipImage =
        frontCitizenshipImageLocation;
      editFrontQuery.frontCitizenshipFile.frontCitizenshipPublicId =
        req.files?.frontCitizenshipImage[0]?.publicId;
    }

    User.findById({ _id: userId })
      .lean()
      .then(async (res) => {
        console.log(res.frontCitizenshipFile?.frontCitizenshipPublicId);
        if (
          frontCitizenshipImageLocation &&
          (await res.frontCitizenshipFile?.frontCitizenshipPublicId)
        ) {
          await deleteFileCloudinary(
            res.frontCitizenshipFile?.frontCitizenshipPublicId
          );
        }
      })
      .catch((err) => {
        throw new SetErrorResponse("Error deleting file cloudinary", 500);
      });

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        ...editFrontQuery,
      },
      { new: true }
    ).lean();

    if (
      frontCitizenshipImageLocation &&
      user?.frontCitizenshipFile?.frontCitizenshipPublicId
    ) {
      deleteFileLocal({ imagePath: req.files.frontCitizenshipImage[0]?.path });
    }

    if (
      !user ||
      user.isVerified == "pending" ||
      user.isVerified == "rejected"
    ) {
      throw new SetErrorResponse("User not found"); // default (Not found,404)
    }

    return res.success({ userData: user }, "Success");
  } catch (err) {
    res.fail(err);
  }
};

exports.patchUserBackDocument = async (req, res) => {
  try {
    const userId = res.locals.authData?._id;
    const backCitizenshipImageLocation =
      req.files?.backCitizenshipImage?.length > 0
        ? req.files.backCitizenshipImage[0]?.location
        : undefined;

    var editBackQuery = {};

    if (backCitizenshipImageLocation) {
      editBackQuery = {
        backCitizenshipFile: {},
      };
      editBackQuery.backCitizenshipFile.backCitizenshipImage =
        backCitizenshipImageLocation;
      editBackQuery.backCitizenshipFile.backCitizenshipPublicId =
        req.files?.backCitizenshipImage[0]?.publicId;
    }

    User.findById({ _id: userId })
      .lean()
      .then(async (res) => {
        console.log(res.backCitizenshipFile?.backCitizenshipPublicId);
        if (
          backCitizenshipImageLocation &&
          res.backCitizenshipFile?.backCitizenshipPublicId
        ) {
          await deleteFileCloudinary(
            res.backCitizenshipFile?.backCitizenshipPublicId
          );
        }
      })
      .catch((err) => {
        throw new SetErrorResponse("Error deleting file cloudinary", 500);
      });

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        ...editBackQuery,
      },
      { new: true }
    ).lean();

    if (
      backCitizenshipImageLocation &&
      user?.backCitizenshipFile?.backCitizenshipPublicId
    ) {
      deleteFileLocal({ imagePath: req.files.backCitizenshipImage[0]?.path });
    }

    if (
      !user ||
      user.isVerified == "pending" ||
      user.isVerified == "rejected"
    ) {
      throw new SetErrorResponse("User not found"); // default (Not found,404)
    }

    return res.success({ userData: user }, "Success");
  } catch (err) {
    res.fail(err);
  }
};

exports.patchUser = async (req, res) => {
  try {
    const userId = res.locals?.authData?._id;
    const { firstName, lastName, address, phoneNumber, citizenshipId } =
      req.body;
    const name = firstName + " " + lastName;

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        firstName,
        lastName,
        phoneNumber,
        address,
        name,
        citizenshipId,
      },
      { new: true }
    ).lean();

    if (
      !user ||
      user.isVerified == "pending" ||
      user.isVerified == "rejected"
    ) {
      throw new SetErrorResponse("User not found", 404);
    }

    return res.success({ userData: user }, "User updated");
  } catch (err) {
    return res.fail(err);
  }
};
