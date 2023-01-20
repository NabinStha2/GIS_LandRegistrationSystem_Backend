const { SetErrorResponse } = require("./responseSetter");

exports.failCase = ({ req, res }) => {
  try {
    return (err) => {
      // if (req.file) {
      //   deleteFile(req.file?.location);
      // }

      // if (req.files) {
      //   Object.values(req.files)?.forEach(fileArray=>{
      //     fileArray.forEach(obj=>{
      //       deleteFile(obj?.location)
      //     })
      //   })
      // }
      console.log(err);
      if (err instanceof SetErrorResponse) {
        statusCode = err?._meta_?.status;
        if (!(statusCode > 100 && statusCode < 999)) {
          console.log("Res Fail Error: Bug ");
          statusCode = 500;
        }
        console.log({ metaError: err?._meta_?.error });

        return res.status(statusCode).send({
          error: err?._meta_?.error,
          status: err?._meta_?.status,
        });
      }
      console.log({ metaError: err });

      return res
        .status(500)
        .send({ error: "Internal Server Error", err: err + "" });
    };
  } catch (error) {
    console.log("This error needs Emergency Assist");
    console.log(error);
    return res.status(500).send({ error: "Error needs Emergency Assist" });
  }
};

exports.SuccessCase = ({ req, res }) => {
  return (data, message, otherData) => {
    console.log({ data, message, otherData });
    return res.send({ data, message, otherData });
  };
};
