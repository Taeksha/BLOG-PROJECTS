const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

function CreateOtpAndToken(userData) {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const token = jwt.sign({ userData, otp }, process.env.JWT_SECRET);


  return { otp, token };
}

module.exports = CreateOtpAndToken;
