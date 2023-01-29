const jwt = require("jsonwebtoken");
const { customSecretKey } = require("../utils/customSecretKey");
const User = require("../models/user.model");
const { SetErrorResponse } = require("../utils/responseSetter");
const Admin = require("../models/admin.model");

exports.checkAuthValidation = async (req, res, next) => {
  let token;
  try {
    if (!req.headers.authorization) {
      throw new SetErrorResponse("Auth Token Not Found", 401);
    }

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        const isCustomAuth = token.length < 500;

        const datas = jwt.decode(token);

        if (!datas) throw new SetErrorResponse("Invalid token");

        let admin = await Admin.findOne({ _id: datas._id });
        let user = await User.findOne({ _id: datas._id });

        console.log(`admin :: ${admin} ---- user :: ${user}`);

        if (!admin && !user) {
          throw new SetErrorResponse(`User Not Found:`, 401);
        }

        if (token && isCustomAuth) {
          const data = jwt.verify(token, customSecretKey(datas._id));
          res.locals.authData = data;
          res.locals.authData.isAdmin = admin ? true : false;
          res.locals.authData.success = true;

          if (res.locals.authData?._id) {
            const userId = res.locals.authData?._id;
            console.log(
              "user authentication id: " +
                "params: " +
                req.params.id +
                " : " +
                datas._id +
                " : " +
                userId
            );
          }
        }
        if (!res.locals.authData || !res.locals?.authData?.success) {
          return res
            .status(res?.locals?.authData?.status || 500)
            .send({ message: res?.locals?.authData?.message });
        }
      } catch (err) {
        console.log(`Err auth validation :: ${err.message}`);
        throw err;
      }
    }
    next();
  } catch (error) {
    console.log(error);
    res.fail(error);
  }
};
