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
              .isLength({ min: 8, max: 30 })
          );
          break;

        case "firstName":
          result.push(
            check(
              "firstName",
              "First Name should be between 3 to 50 characters, it is required and should be string"
            )
              .notEmpty()
              .isLength({ min: 3, max: 50 })
              .isString()
          );
          break;

        case "lastName":
          result.push(
            check(
              "lastName",
              "Last Name should be between 3 to 50 characters, it is required and should be string"
            )
              .notEmpty()
              .isLength({ min: 3, max: 50 })
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
              "Address should be between 5 to 50 characters and it should be string"
            )
              .isLength({ min: 5, max: 50 })
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

        case "userId":
          result.push(
            check("userId", "UserID not Valid")
              .notEmpty()
              .isString()
              .withMessage("UserID should be string value")
          );
          break;
      }
    });
    return result;
  } catch (error) {
    console.log(error);
    // errorHandler({ res, error, message: "Validation Related Errors" });
  }
};
