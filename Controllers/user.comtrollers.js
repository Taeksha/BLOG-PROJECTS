
const bcrypt = require("bcrypt");
const userModel = require("../Models/user.model");
require("dotenv").config()
var jwt = require('jsonwebtoken');
const CreateOtpAndToken = require("../utils/otp");
const Sendmail = require("../utils/sendmail");
const ejs=require("ejs")
const path=require("path")
//sihnup
const signup = async (req, res) => {
  const { email, name, password } = req.body;

  if (req.body.role) {
    return res
      .status(400)
      .json({ message: "you can  not have permission for this" });
  }

  if (!email || !name || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const { otp, token } = CreateOtpAndToken({ ...req.body });

  try {
    const htmltemplate = await ejs.renderFile(
      __dirname + "/../views/email.ejs",
      {
        name,
        otp,
      }
    );

    console.log(1);
    let result = await Sendmail(email, htmltemplate);
    console.log(result);

    res
      .cookie("verification_token", token)
      .status(200)
      .json({ message: "Otp send ..." });
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
}


//verify
const verify =async(req , res)=>{
  if (!req.cookies.verification_token) {
    return res.status(400).json({ message: "please sign up first" });
  }

  try {
  const decoded = jwt.verify(
      req.cookies.verification_token,
      process.env.JWT_SECRET
    );

console.log(decoded)
    if (!decoded) {
      return res.status(400).json({ message: "token is invalid" });
    }
    const { otp, userData } = decoded;

    if (otp !== req.body.otp) {
      return res.status(400).json({ message: "otp is  not valid" });
    }
    //hashpassword
    try {
      const hashpassword = await bcrypt.hash(userData.password , 10);

      // Save the user in the database
      const user = await userModel.create({
      ...userData,
        password: hashpassword,
      });

      // Render confirmation message using EJS template
      const htmltemplate = await ejs.renderFile(
        path.join(__dirname, "../views/confirmation.ejs"),
        {
          name: userData.name,
        }
      ); // Send the confirmation email
      await Sendmail(userData.email, htmltemplate, "confirmation message");

      res
        .status(201)
        .json({ message: "User registered and email sent.", user });
    } catch (error) {
      return res.status(400).json({ message: error?.message });
    }
  } catch (error) {
    return res.status(400).json({ message: error?.message });
  }
}

//signin

const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const isExistUser = await userModel.findOne({ email });
    if (!isExistUser) {
      return res.status(400).json({ message: "please create account first " });
    }
    bcrypt.compare(password, isExistUser.password, (err, result)=> {
      if(err)
      {
        return res.status(400).json({message:err.message})
      }
      if(!result)
      {
        return res.status(400).json({message:"invalid password"})
      }

      const{password,...rest}=isExistUser._doc
      jwt.sign({ user:rest },process.env.privateKey ,  (err, token)=> {
        if(err)
          {
            return res.status(400).json({message:err.message})
          }
          if(!token)
          {
            return res.status(400).json({message:"token not created"})
          }

          console.log(token)
         res.cookie("verificationToken",token).status(200).json({message:"user login successfully ",user:rest})

      });
  });




    
  } catch (error) {
    res.status(400).json({message:error.message})
  }

 
}


module.exports = { signup ,signin ,verify};
