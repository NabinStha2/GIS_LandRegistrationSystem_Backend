const mongoose = require("mongoose");

module.exports.connectDB = async (app) => {
  try {
    const port = process.env.PORT || 5000;
    app.set("port", port);

    const db = await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (db) {
      console.log(
        "Connected to database with host:" +
          `${db?.connection?.host} and name: ${db?.connection?.name}`
      );
      app.listen(port, () => {
        console.log(
          `Server is listening on http://localhost: ${Date()}`,
          `, PORT ::`,
          port
        );
      });
    }
  } catch (err) {
    console.log(err);
  }
};
