exports.generateOTP = () => {
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += Math.floor(Math.random() * 10);
    console.log(`OTP : ${OTP}`);
  }
  console.log(OTP);
  return OTP;
};
