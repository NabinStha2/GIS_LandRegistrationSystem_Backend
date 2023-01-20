const multer = require("multer");
const cloudinary = require("../utils/cloudinary");

exports.uploadImages = ({
  secondaryPath = "GIS/landRegistration",
  path = "GISLandRegistrationPath",
  singleName = "",
  multi = false,
  fileSize = 122880,
  allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"],
}) => {
  const uploadImages = () => {
    const storage = multer.memoryStorage();

    const fileFilter = (req, file, cb) => {
      //reject file
      if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };

    const upload = multer({
      storage,
      fileFilter: fileFilter,
      limit: {
        fileSize,
      },
    }).fields([
      {
        name: "frontCitizenshipImage",
      },
      {
        name: "backCitizenshipImage",
      },
      {
        name: "userImage",
      },
    ]);
    return upload;
  };

  const cloudinaryUpload = async (req, res, next) => {
    try {
      console.log(req.files);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `developing/${path}`,
        resource_type: "image",
        public_id: req.file.filename.split(".")[0],
      });
      console.log(result.public_id, result.secure_url);

      next();
    } catch (err) {
      return res.fail(err);
    }
  };

  return [uploadImages(), cloudinaryUpload];
};
