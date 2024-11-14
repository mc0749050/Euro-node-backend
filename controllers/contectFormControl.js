const contectModel = require("../models/contectSchema");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cheerio = require("cheerio");
const path = require("path");

let htmlContent = "";

fs.readFile(
  path.join(__dirname, "../emailpages/formSubmitemail.html"),
  "utf-8",
  (err, data) => {
    if (err) {
      console.error(err);
    }
    htmlContent = data;
    return;
  }
);

exports.submitContectApi = async (req, res) => {
  const { name, email, title, phone, message } = req.body;

  try {
    const newcontectFormData = new contectModel({
      name,
      email,
      title,
      phone,
      message,
    });

    const contectFormData = await newcontectFormData.save();

    if (contectFormData) {
      // for Email send

      const $ = cheerio.load(htmlContent);
      $("#FormEmailName").text(`${name}`);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL,
          pass: process.env.MAIL_AUTH,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: `Euro`,
        html: $.html(),
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
      });

      return res
        .status(200)
        .json({ success: true, message: "Form submited successfully !" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong !" });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "Technical issue !" });
  }
};
