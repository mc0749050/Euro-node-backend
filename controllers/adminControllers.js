const product = require("../models/productSchema");
const contectModel = require("../models/contectSchema");
const nodemailer = require("nodemailer");
const User = require('../models/userSchema');
const fs = require('fs');
const path = require('path')


    // tranpoter system

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.MAIL_AUTH,
      },
    });


//for add products

exports.addProduct = async (req, res) => {
  try {
    const { name, new_price, old_price, instock } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : [];

    const productdata = new product({
      name,
      new_price,
      old_price,
      images,
      stocknumber:instock,
    });

    const savedProductData = await productdata.save();

    if (savedProductData) {
      res
        .status(201)
        .json({ success: true, message: "product added successfully!" });
    } else {
      res.status(404).json({ success: false, message: "product not added!" });
    }
  } catch (error) {
    console.error(error); // Logs the error
    res.status(400).json({ success: false, message: "Technical issue!" });
  }
};

// for get contact forms

exports.getContactNotification = async (req, res) => {
  try {
    const contactForms = await contectModel.find();

    if (contactForms) {
      res
        .status(200)
        .json({
          success: true,
          message: "form data get successfully !",
          contactForms,
        });
    } else {
      res.status(404).json({ success: false, message: "form data not get !" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Technical issue!" });
  }
};

// for delete contact form

exports.deleteContactForm = async (req, res) => {
  try {
    const { email } = req.body;

    const deletedUser = await contectModel.findOneAndDelete({ email });

    if (deletedUser) {
      return res
        .status(201)
        .json({ success: true, message: "Deleted successfull !" });
    }

    res.status(404).json({ success: false, message: "message not found" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Technical issue!" });
  }
};

exports.getUserDataById = async (req, res) => {
  try {
    const { id } = req.body;

    const userformdata = await contectModel.findOne({ _id: id });

    if (userformdata) {
      return res
        .status(201)
        .json({
          success: true,
          message: "user data get successfull !",
          userformdata,
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Technical error !" });
  }
};

exports.sendReplyContactform = async (req, res) => {
  try {
    const { email, sendmessage } = req.body;


    // email template

    const mailOptions = {
      from: "mukeshcoderhub@gmail.com",
      to: email,
      subject: `Euro`,
      html: sendmessage,
    };

    // send email

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res
          .status(400)
          .json({ success: false, message: "failed to send" });
      } else {
        await contectModel.findOneAndUpdate({email}, {$set: {isreplyed: true}}, {new: true})
        return res.status(201).json({ success: true, message: "Email send successfull !" });
      }
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Technical error !" });
  }
};


// for send email to all users from admin

const sendBulkEmail = async (userEmails, htmlMessage) => {
  const recipients = userEmails.join(","); // Join emails with commas

  const mailOptions = {
    from: "mukeshcoderhub.com",
    to: '', // All recipients in a single string
    bcc: recipients,
    subject: "Euro",
    html: htmlMessage,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


exports.sendEmailFromAdmin = async (req, res) => {

  const {htmlMessage} = req.body;

  try{
    const users = await User.find({}, "email"); // Only selects the 'email' field
    const userEmails = users.map(user => user.email);
    await sendBulkEmail(userEmails, htmlMessage);
    return res.status(201).json({success:true, message:"Email send successfull !"})

  } catch{
    res.status(400).json({success: false, message: "Technical error !"})
  }
} 

// for get products data

exports.getProductsData = async (req, res) =>{
  try {
    const productsData = await product.find({})

    if(productsData) {
      res.status(201).json({productsData})
    }
    
  } catch (error) {
    console.log(error);
    
  }
}



// for delete product 

exports.deleteProductAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    // First, find the product to get the image paths
    const productToDelete = await product.findById(id);
    if (!productToDelete) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    // Delete the product document
    await product.findByIdAndDelete(id);

    // Iterate over each image in the array and delete it
    productToDelete.images.forEach((image) => {
      const filePath = path.join(__dirname, '..' ,image);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    });

    return res.status(201).json({ success: true, message: "Product deleted!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(400).json({ success: false, message: "Technical issue" });
  }
};