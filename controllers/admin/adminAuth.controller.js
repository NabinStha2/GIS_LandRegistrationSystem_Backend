const { setCacheOTP, getCacheOTP } = require("../../cache/cacheOTP");
const Admin = require("../../models/admin.model");
const { customSecretKey } = require("../../utils/customSecretKey");
const { generateOTP } = require("../../utils/generateOTP");
const { sendEmailToEmailAddress } = require("../../utils/mail");
const { SetErrorResponse } = require("../../utils/responseSetter");
const { userDataPipelining } = require("../../utils/userDataPipelining");
const jwt = require("jsonwebtoken");

exports.adminRegisterController = async (req, res, next) => {
  try {
    const { email, firstName, lastName, phoneNumber, address, password } =
      req.body;
    const otp = generateOTP();

    const savingValues = {
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      password,
      otp,
    };
    setCacheOTP({ email, prefix: "register", savingValues });

    const sendEmail = await sendEmailToEmailAddress({
      email,
      otp,
      subject:
        "Welcome From A GIS based land registration system! Thanks You for Registration. ",
    });

    if (!sendEmail) throw new SetErrorResponse();

    return res.success({ email }, `OTP send to user's Email`);
  } catch (err) {
    console.log(err);
    return res.fail(err);
  }
};

exports.adminVerifyOTPAndRegisterController = async (req, res, next) => {
  try {
    const { email, OTP } = req.body;
    const values = await getCacheOTP({ email, prefix: "register" });

    console.log({ OTP });
    console.log({ values });

    if (!(OTP == values?.otp))
      throw new SetErrorResponse("OTP validation failed", 403);
    const { firstName, lastName, phoneNumber, address, password } = values;

    const admin = new Admin({
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      password,
    });

    const name = firstName + " " + lastName;
    admin.name = name;

    await admin.save();

    const adminData = userDataPipelining(admin);
    const token = jwt.sign(adminData, customSecretKey(adminData?._id), {
      expiresIn: "2d",
    });

    return res.success({ adminData, token });
  } catch (err) {
    return res.fail(err);
  }
};

exports.adminloginController = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const expiresIn = rememberMe ? "7d" : "2d";

    const existingUserData = await Admin.findOne(
      { email },
      "+salt +hashed_password"
    );
    console.log(existingUserData);
    if (!existingUserData?.authentication(password)) {
      throw new SetErrorResponse("Unauthorized, Password Incorrect", 401);
    }
    const userData = userDataPipelining(existingUserData);
    const token = jwt.sign(userData, customSecretKey(existingUserData?._id), {
      expiresIn: expiresIn,
    });

    return res.success(
      { token, userData: { ...userData, image: existingUserData?.image } },
      "Login Successful !"
    );
  } catch (err) {
    return res.fail(err);
  }
};
