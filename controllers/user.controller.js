const User = require("../models/user.model");
const {
  deleteFile,
  deleteFileLocal,
  deleteFileCloudinary,
} = require("../utils/fileHandling");
const { getFuzzySearchPaginatedData } = require("../utils/pagination");
const { SetErrorResponse } = require("../utils/responseSetter");

exports.getUser = async (req, res) => {
  try {
    const userId = req.params?.userId;
    const existingUser = await User.findById({ _id: userId }).lean();

    if (!existingUser) {
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
    const frontCitizenshipImageLocation =
      req.files?.frontCitizenshipImage?.length > 0
        ? req.files.frontCitizenshipImage[0]?.location
        : undefined;
    const backCitizenshipImageLocation =
      req.files?.backCitizenshipImage?.length > 0
        ? req.files.backCitizenshipImage[0]?.location
        : undefined;

    const editUserImageQuery = {};
    var editFrontQuery = {};
    var editBackQuery = {};

    if (userImageLocation) {
      editUserImageQuery.imageFile = {};
      editUserImageQuery.imageFile.imageUrl = userImageLocation;
      editUserImageQuery.imageFile.imagePublicId =
        req.files?.userImage[0]?.publicId;
    }
    if (frontCitizenshipImageLocation) {
      editFrontQuery = {
        frontCitizenshipFile: {},
      };
      editFrontQuery.frontCitizenshipFile.frontCitizenshipImage =
        frontCitizenshipImageLocation;
      editFrontQuery.frontCitizenshipFile.frontCitizenshipPublicId =
        req.files?.frontCitizenshipImage[0]?.publicId;
    }
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
        console.log(res.imageFile?.imagePublicId);
        if (userImageLocation && res.imageFile?.imagePublicId) {
          await deleteFileCloudinary(res.imageFile?.imagePublicId);
        }
        if (
          frontCitizenshipImageLocation &&
          (await res.frontCitizenshipFile?.frontCitizenshipPublicId)
        ) {
          await deleteFileCloudinary(
            res.frontCitizenshipFile?.frontCitizenshipPublicId
          );
        }
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
        ...editUserImageQuery,
        ...editFrontQuery,
        ...editBackQuery,
      },
      { new: true }
    ).lean();

    console.log({ user });

    if (userImageLocation && user?.imageFile?.imageUrl) {
      deleteFileLocal({ imagePath: req.files.userImage[0]?.path });
    }
    if (
      frontCitizenshipImageLocation &&
      user?.frontCitizenshipFile?.frontCitizenshipPublicId
    ) {
      deleteFileLocal({ imagePath: req.files.frontCitizenshipImage[0]?.path });
    }
    if (
      backCitizenshipImageLocation &&
      user?.backCitizenshipFile?.backCitizenshipPublicId
    ) {
      deleteFileLocal({ imagePath: req.files.backCitizenshipImage[0]?.path });
    }

    if (!user) {
      throw new SetErrorResponse("User not found"); // default (Not found,404)
    }

    return res.success({ userData: user }, "Success");
  } catch (err) {
    return res.fail(err);
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

    if (!user) {
      throw new SetErrorResponse("User not found", 404);
    }

    return res.success({ userData: user }, "User updated");
  } catch (err) {
    return res.fail(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = res.locals.authData?._id;
    const user = await User.findByIdAndDelete({ _id: userId });
    if (!user) {
      throw new SetErrorResponse("User not found"); // default (Not found,404)
    }
    return res.success({ userData: user }, "User Deleted ");
  } catch (err) {
    return res.fail(err);
  }
};
