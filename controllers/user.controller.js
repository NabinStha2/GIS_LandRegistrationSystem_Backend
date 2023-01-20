const User = require("../models/user.model");
const {
  deleteFile,
  deleteFileLocal,
  deleteFileCloudinary,
} = require("../utils/fileHandling");
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
    const users = await User.find().lean();

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
    const editQuery = {};

    if (userImageLocation) {
      editQuery.image = userImageLocation;
      editQuery.imagePublicId = req.files?.userImage[0]?.publicId;
    }

    const [deleteData, user] = await Promise.all([
      User.findById({ _id: userId })
        .lean()
        .then((res) => {
          deleteFileCloudinary(res.imagePublicId);
        }),
      User.findOneAndUpdate(
        { _id: userId },
        {
          ...editQuery,
        },
        { new: true }
      ).lean(),
    ]);

    console.log({ deleteData, user });

    // const user = await User.findOneAndUpdate(
    //   { _id: userId },
    //   {
    //     ...editQuery,
    //   }
    // ).lean();

    if (userImageLocation && user?.image) {
      deleteFileLocal({ imagePath: req.files.userImage[0]?.path });
    }

    if (!user) {
      throw new SetErrorResponse("User not found"); // default (Not found,404)
    }
    return res.success("User Updated", "Success");
  } catch (err) {
    return res.fail(err);
  }
};

exports.patchUser = async (req, res) => {
  try {
    const userId = res.locals?.authData?._id;
    const { firstName, lastName, address, phoneNumber } = req.body;
    const name = firstName + " " + lastName;

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        firstName,
        lastName,
        phoneNumber,
        address,
        name,
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
