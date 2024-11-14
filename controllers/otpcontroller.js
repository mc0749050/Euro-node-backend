const nodemailer = require("nodemailer");
const fs = require("fs");
const cheerio = require("cheerio");
const path = require("path");
const User = require("../models/userSchema");
const { hashPassword } = require("../helper/authHelper");
let htmlContent = "";

fs.readFile(
  path.join(__dirname, "../emailpages/otp.html"),
  "utf-8",
  (err, data) => {
    if (err) {
      console.error(err);
    }
    htmlContent = data;
    return;
  }
);

// for otp send

exports.otpEmailsend = (req, res) => {
  const { otp, email } = req.body;

  const $ = cheerio.load(htmlContent);
  $("#myotpDiv").text(`${otp}`);
  $("#email").text(`${email}`);

  // tranpoter system

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.MAIL_AUTH,
    },
  });

  // email template

  const mailOptions = {
    from: "mukeshcoderhub@gmail.com",
    to: email,
    subject: `Euro`,
    html: $.html(),
  };

  // send email

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: "failed to send" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "otp send successfull !" });
    }
  });
};

exports.checkUserAndSendOtp = async (req, res) => {
  const { reemail, reotp } = req.body;

  try {
    const checkUser = await User.findOne({ email: reemail });

    if (!checkUser) {
      return res.status(409).json({
        success: false,
        message: "User is not found !",
      });
    }

    const $ = cheerio.load(htmlContent);
    $("#myotpDiv").text(`${reotp}`);
    $("#content-heading").text(`Reset password`);
    $("#email").text(`${reemail}`);

    // tranpoter system

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.MAIL_AUTH,
      },
    });

    // email template

    const mailOptions = {
      from: "mukeshcoderhub@gmail.com",
      to: reemail,
      subject: `Euro`,
      html: $.html(),
    };

    // send email

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res
          .status(400)
          .json({ success: false, message: "failed to send" });
      } else {
        return res
          .status(201)
          .json({ success: true, message: "otp send successfull !" });
      }
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Otp is not send !",
    });
  }
};

// for reset password

exports.resetPasswordApi = async (req, res) => {
  const { reemail, userotp, newpass, reotp } = req.body;

  if (userotp != reotp) {
    return res.status(400).json({ success: false, message: "Otp invalid !" });
  }

  try {
    const hashedPassword = await hashPassword(newpass);

    const user = await User.findOneAndUpdate(
      { email: reemail },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (user) {
      return res
        .status(201)
        .json({ success: true, message: "Password updated successfully !" });
    } else {
      return res.status(404).json({ success: false, message: "Error occur !" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Try after some time !" });
  }
};
