const fs = require("fs");
const cloudinary = require("../utils/cloudinary.init");

exports.getFileLocation = function (file) {
  return file.location;
};

exports.deleteFileCloudinary = async function (fileLocation) {
  try {
    return await cloudinary.uploader.destroy(fileLocation);
  } catch (err) {
    console.log("ERROR AT DELETE FILE");
    throw err;
  }
};

exports.deleteFileLocal = async ({ imagePath }) => {
  fs.unlinkSync(imagePath);
};
