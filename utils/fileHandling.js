exports.getFileLocation = function (file) {
  return file.location;
};

exports.deleteFile = function (fileLocation) {
  try {
    const s3 = getS3();
    const getObjectParams = () => {
      let bName = DIGITAL_OCEAN_SPACE.NAME;
      if (typeof fileLocation != "string") {
        return;
      }
      const BucketFiles = fileLocation
        ?.split(`.${DIGITAL_OCEAN_SPACE.REGION}.digitaloceanspaces.com`)[1]
        ?.split("/");

      const Key = BucketFiles?.pop();
      const Bucket = bName + BucketFiles?.join("/");
      console.log("Image deleting !!!");
      console.log({ Key, Bucket });

      return {
        Key,
        Bucket,
      };
    };

    return s3?.deleteObject(getObjectParams(), (err, data) => {
      console.log(err);
    });
  } catch (err) {
    console.log("ERROR AT DELETE FILE");
    throw err;
  }
};
