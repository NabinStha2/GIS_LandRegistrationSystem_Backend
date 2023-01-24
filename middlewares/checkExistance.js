const { SetErrorResponse } = require("../utils/responseSetter");

exports.checkExistance = (model, queries, varName) => {
  const returnFunc = async (req, res, next) => {
    try {
      console.log({ queries });
      const getQuery = () => {
        const returningData = {};
        queries?.forEach((query) => {
          const { key, value } = query;
          const values = value?.split(".");
          returningData[key] = values?.reduce((prev, current) => {
            // console.log(prev[current]);
            return prev[current]; //req.body.email
          }, req);
        });
        return returningData; // {email:req.body.email}
      };

      const valueToCheck = getQuery();
      // console.log({valueToCheck})
      const existedDoc = await model.findOne(valueToCheck);
      if (!existedDoc) {
        throw new SetErrorResponse(
          `${[Object.keys(valueToCheck)]} Not Found`,
          404
        );
      }
      req.existedDoc = existedDoc;
      if (varName) {
        req[varName] = existedDoc;
      }

      next();
    } catch (err) {
      return res.fail(err);
    }
  };
  return [returnFunc];
};
