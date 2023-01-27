const User = require("../models/user.model");
const { SetErrorResponse } = require("../utils/responseSetter");

exports.checkDuplicateValue = (model, queries) => {
  const returnFunc = async (req, res, next) => {
    try {
      const getQuery = () => {
        const returningData = {};
        queries.forEach((query) => {
          const { key, value } = query;
          const values = value.split(".");
          returningData[key] = values.reduce((_req, _value) => {
            // console.log(_req, _value);
            return _req[_value]; //req.body.email
          }, req);
        });
        return returningData;
      };
      const valueToCheck = getQuery();
      console.log(valueToCheck);
      const valueChecked = await User.findOne({
        $or: [
          { email: valueToCheck.email },
          {
            phoneNumber: valueToCheck.phoneNumber,
          },
        ],
      });
      // console.log(valueChecked);
      if (valueChecked) {
        throw new SetErrorResponse(
          `${[Object.keys(valueToCheck)]} already exist`,
          403
        );
      }
      next();
    } catch (err) {
      return res.fail(err);
    }
  };
  return [returnFunc];
};
