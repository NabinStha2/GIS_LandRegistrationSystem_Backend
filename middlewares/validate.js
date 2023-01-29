const { check, query, validationResult } = require("express-validator");

exports.validate = (params) => {
  try {
    let result = [];
    params.forEach((param) => {
      switch (param) {
        case "email":
          result.push(
            check(
              "email",
              "Email should be between 5 to 50 characters and proper Email"
            )
              .notEmpty()
              .isLength({ min: 5, max: 50 })
              .isEmail()
              .normalizeEmail()
          );
          break;

        case "password":
          result.push(
            check(
              "password",
              "password should be more than 8 character but less than 30 char"
            )
              .notEmpty()
              .isString()
              .withMessage("Password should be in string form")
              .isLength({ min: 6, max: 30 })
          );
          break;

        case "firstName":
          result.push(
            check(
              "firstName",
              "First Name should be between 2 to 50 characters, it is required and should be string"
            )
              .notEmpty()
              .isLength({ min: 2, max: 50 })
              .isString()
          );
          break;

        case "lastName":
          result.push(
            check(
              "lastName",
              "Last Name should be between 2 to 50 characters, it is required and should be string"
            )
              .notEmpty()
              .isLength({ min: 2, max: 50 })
              .isString()
          );
          break;

        case "name":
          result.push(
            check(
              "name",
              "Name should be between 2 to 50 characters and it should be string"
            )
              .notEmpty()
              .isLength({ min: 2, max: 50 })
              .isString()
          );
          break;

        case "address":
          result.push(
            check(
              "address",
              "Address should be between 2 to 50 characters and it should be string"
            )
              .isLength({ min: 2, max: 50 })
              .isString()
              .optional()
          );
          break;

        case "phoneNumber":
          result.push(
            check("phoneNumber", "PhoneNumber not Valid, (Mobile phone number)")
              .optional()
              .isLength({ min: 7, max: 15 })
              .isMobilePhone("ne-NP")
          );
          break;

        case "OTP":
          result.push(
            check("OTP", "OTP must be of 4 digits")
              .notEmpty()
              .isLength({ min: 4, max: 4 })
              .isString()
              .withMessage("OTP should be string value")
          );
          break;

        case "id":
          result.push(
            check("id", "Id not Valid")
              .notEmpty()
              .isString()
              .withMessage("Id should be string value")
          );
          break;

        case "parcelId":
          result.push(
            check("parcelId", "Parcel ID not Valid")
              .notEmpty()
              .isInt()
              .toInt()
              .withMessage("ParcelId should be integer value")
          );
          break;

        case "city":
          result.push(
            check("city", "City not Valid")
              .notEmpty()
              .isString()
              .withMessage("City should be string value")
          );
          break;

        case "area":
          result.push(
            check("area", "Area not Valid")
              .isString()
              .withMessage("Area should be string value")
          );
          break;

        case "ownerUserId":
          result.push(
            check("ownerUserId", "Owner User must be mongoId")
              .notEmpty()
              .isMongoId()
          );
          break;

        case "wardNo":
          result.push(
            check("wardNo", "WardNo not Valid")
              .notEmpty()
              .toInt()
              .isInt()
              .withMessage("WardNo should be integer value")
          );
          break;

        case "district":
          result.push(
            check("district", "District not Valid")
              .notEmpty()
              .isString()
              .withMessage("District should be String value")
          );
          break;

        case "province":
          result.push(
            check("province", "Province not Valid")
              .notEmpty()
              .isString()
              .withMessage("Province should be String value")
          );
          break;

        case "latitude":
          result.push(
            check("latitude", "Latitude not Valid")
              .notEmpty()
              .toInt()
              .isInt()
              .withMessage("Latitude should be integer value")
          );
          break;

        case "longitude":
          result.push(
            check("longitude", "Longitude not Valid")
              .notEmpty()
              .toInt()
              .isInt()
              .withMessage("Longitude should be integer value")
          );
          break;

        case "surveyNo":
          result.push(
            check("surveyNo", "SurveyNo not Valid")
              .notEmpty()
              .toInt()
              .isInt()
              .withMessage("SurveyNo should be integer value")
          );
          break;

        case "landPrice":
          result.push(
            check("landPrice", "LandPrice not Valid")
              .notEmpty()
              .toInt()
              .isInt()
              .withMessage("LandPrice should be integer value")
          );
          break;
      }
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};
