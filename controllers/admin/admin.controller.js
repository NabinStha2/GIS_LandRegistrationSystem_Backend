const Admin = require("../../models/admin.model");
const User = require("../../models/user.model");
const {
  deleteFileLocal,
  deleteFileCloudinary,
} = require("../../utils/fileHandling");
const { getFuzzySearchPaginatedData } = require("../../utils/pagination");
const { SetErrorResponse } = require("../../utils/responseSetter");

exports.getAdmin = async (req, res) => {
  try {
    const userId = req.params?.userId;
    const existingUser = await Admin.findById({ _id: userId }).lean();

    console.log(existingUser);

    if (!existingUser) {
      throw new SetErrorResponse("Admin not found", 404);
    }

    return res.success({ userData: existingUser });
  } catch (err) {
    return res.fail(err);
  }
};

exports.getAllUsersByAdmin = async (req, res) => {
  try {
    const { page, limit, search = "", sort } = req.query;
    const users = await getFuzzySearchPaginatedData({
      model: User,
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

    if (!users) {
      throw new SetErrorResponse("Users not found", 404);
    }

    return res.success({ userData: users });
  } catch (err) {
    return res.fail(err);
  }
};

exports.patchAdminImage = async (req, res) => {
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

    Admin.findById({ _id: userId })
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

    const admin = await Admin.findOneAndUpdate(
      { _id: userId },
      {
        ...editUserImageQuery,
      },
      { new: true }
    ).lean();

    if (userImageLocation && admin?.imageFile?.imageUrl) {
      deleteFileLocal({ imagePath: req.files.userImage[0]?.path });
    }

    if (!admin) {
      throw new SetErrorResponse("Admin not found"); // default (Not found,404)
    }

    return res.success({ userData: admin }, "Success");
  } catch (err) {
    return res.fail(err);
  }
};

// exports.patchAdminFrontDocument = async (req, res) => {
//   try {
//     const userId = res.locals.authData?._id;
//     const frontCitizenshipImageLocation =
//       req.files?.frontCitizenshipImage?.length > 0
//         ? req.files.frontCitizenshipImage[0]?.location
//         : undefined;

//     if (frontCitizenshipImageLocation) {
//       editFrontQuery = {
//         frontCitizenshipFile: {},
//       };
//       editFrontQuery.frontCitizenshipFile.frontCitizenshipImage =
//         frontCitizenshipImageLocation;
//       editFrontQuery.frontCitizenshipFile.frontCitizenshipPublicId =
//         req.files?.frontCitizenshipImage[0]?.publicId;
//     }

//     Admin.findById({ _id: userId })
//       .lean()
//       .then(async (res) => {
//         console.log(res.frontCitizenshipFile?.frontCitizenshipPublicId);
//         if (
//           frontCitizenshipImageLocation &&
//           (await res.frontCitizenshipFile?.frontCitizenshipPublicId)
//         ) {
//           await deleteFileCloudinary(
//             res.frontCitizenshipFile?.frontCitizenshipPublicId
//           );
//         }
//       })
//       .catch((err) => {
//         throw new SetErrorResponse("Error deleting file cloudinary", 500);
//       });

//     const admin = await Admin.findOneAndUpdate(
//       { _id: userId },
//       {
//         ...editFrontQuery,
//       },
//       { new: true }
//     ).lean();

//     if (
//       frontCitizenshipImageLocation &&
//       admin?.frontCitizenshipFile?.frontCitizenshipPublicId
//     ) {
//       deleteFileLocal({ imagePath: req.files.frontCitizenshipImage[0]?.path });
//     }

//     if (
//       !admin ||
//       admin.isVerified == "pending" ||
//       admin.isVerified == "rejected"
//     ) {
//       throw new SetErrorResponse("Admin not found"); // default (Not found,404)
//     }

//     return res.success({ userData: admin }, "Success");
//   } catch (err) {
//     res.fail(err);
//   }
// };

// exports.patchAdminBackDocument = async (req, res) => {
//   try {
//     const userId = res.locals.authData?._id;
//     const backCitizenshipImageLocation =
//       req.files?.backCitizenshipImage?.length > 0
//         ? req.files.backCitizenshipImage[0]?.location
//         : undefined;

//     var editBackQuery = {};

//     if (backCitizenshipImageLocation) {
//       editBackQuery = {
//         backCitizenshipFile: {},
//       };
//       editBackQuery.backCitizenshipFile.backCitizenshipImage =
//         backCitizenshipImageLocation;
//       editBackQuery.backCitizenshipFile.backCitizenshipPublicId =
//         req.files?.backCitizenshipImage[0]?.publicId;
//     }

//     Admin.findById({ _id: userId })
//       .lean()
//       .then(async (res) => {
//         console.log(res.backCitizenshipFile?.backCitizenshipPublicId);
//         if (
//           backCitizenshipImageLocation &&
//           res.backCitizenshipFile?.backCitizenshipPublicId
//         ) {
//           await deleteFileCloudinary(
//             res.backCitizenshipFile?.backCitizenshipPublicId
//           );
//         }
//       })
//       .catch((err) => {
//         throw new SetErrorResponse("Error deleting file cloudinary", 500);
//       });

//     const admin = await Admin.findOneAndUpdate(
//       { _id: userId },
//       {
//         ...editBackQuery,
//       },
//       { new: true }
//     ).lean();

//     if (
//       backCitizenshipImageLocation &&
//       admin?.backCitizenshipFile?.backCitizenshipPublicId
//     ) {
//       deleteFileLocal({ imagePath: req.files.backCitizenshipImage[0]?.path });
//     }

//     if (
//       !admin ||
//       admin.isVerified == "pending" ||
//       admin.isVerified == "rejected"
//     ) {
//       throw new SetErrorResponse("Admin not found"); // default (Not found,404)
//     }

//     return res.success({ userData: admin }, "Success");
//   } catch (err) {
//     res.fail(err);
//   }
// };

exports.patchAdmin = async (req, res) => {
  try {
    const userId = res.locals?.authData?._id;
    const { firstName, lastName, address, phoneNumber, citizenshipId } =
      req.body;
    const name = firstName + " " + lastName;

    const admin = await Admin.findByIdAndUpdate(
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

    if (!admin) {
      throw new SetErrorResponse("Admin not found", 404);
    }

    return res.success({ userData: admin }, "Admin updated");
  } catch (err) {
    return res.fail(err);
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const userId = res.locals.authData?._id;
    const admin = await Admin.findByIdAndDelete({ _id: userId });
    if (!admin) {
      throw new SetErrorResponse("Admin not found"); // default (Not found,404)
    }
    return res.success({ userData: admin }, "Admin Deleted ");
  } catch (err) {
    return res.fail(err);
  }
};
