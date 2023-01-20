const SibApiV3Sdk = require("sib-api-v3-sdk");

exports.emailInitialSetup = () => {
  var defaultClient = SibApiV3Sdk.ApiClient.instance;
  var apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.GIS_BASED_LAND_REGISTRATION_SENDINBLUE_API_KEY;
};

exports.sendEmailToEmailAddress = async (emailData) => {
  try {
    const { email, otp, subject, userType } = emailData;
    const superAdminEmail = "nabinstha246@gmail.com";
    const toEmail = userType === "user" ? email : superAdminEmail;

    console.log({ emailData });
    console.log(process.env.SENDEREMAIL);
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail = {
      sender: { email: process.env.SENDER_EMAIL },
      to: [
        {
          email: toEmail,
        },
      ],
      subject: `${subject}`,
      textContent: `
          <div>
          <h2> Welcome, in A GIS based land registration system !! </h2>
          <h2> Email from : ${process.env.SENDER_EMAIL} !! </h2>
          <h2> The OTP code is ${otp} </h2>
          </br>
          <h3> Thank you for Registration !! </h3>
          </div>
          `,
    };

    const sendingEmailProcess = await apiInstance.sendTransacEmail(
      sendSmtpEmail
    );
    // console.log({ sendingEmailProcess });
    if (!sendingEmailProcess) return false;
    return true;
  } catch (error) {
    console.log(error);
  }
};
