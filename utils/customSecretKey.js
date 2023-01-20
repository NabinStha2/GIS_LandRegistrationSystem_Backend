exports.customSecretKey = (values = "") => {
  try {
    console.log("random values : ", values);
    return process.env.SECRET_KEY + values;
  } catch (err) {
    console.log(err);
  }
};
