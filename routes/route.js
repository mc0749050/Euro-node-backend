const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  otpEmailsend,
  checkUserAndSendOtp,
  resetPasswordApi,
} = require("../controllers/otpcontroller");
const {
  UserController,
  loginController,
  checkUser,
} = require("../controllers/usercontroller");
const {
  changeNameApi,
  changePhoneApi,
  changeAddressApi,
  getUserData,
} = require("../controllers/changeUserDetails");
const { submitContectApi } = require("../controllers/contectFormControl");
const {
  addProduct,
  getContactNotification,
  deleteContactForm,
  getUserDataById,
  sendReplyContactform,
  sendEmailFromAdmin,
  getProductsData,
  deleteProductAdmin
} = require("../controllers/adminControllers");
const { addToCart, removeToCart } = require("../controllers/productController");
const { RazopayPayment } = require("../controllers/paymentControllers");

//multer setup

const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only image is allowed"));
  }
};
const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

// for otp email send
router.post("/otp-email", otpEmailsend);

// for registration
router.post("/register", UserController);

// for login
router.post("/login", loginController);

//for check user is exit or not
router.post("/check-user", checkUser);

// for send otp for forgot password
router.post("/check-email-send-otp", checkUserAndSendOtp);

//for reset pass
router.post("/reset-pass", resetPasswordApi);

//for change name
router.post("/change-name", changeNameApi);

//for change phone
router.post("/change-phone", changePhoneApi);

//for change address
router.post("/change-address", changeAddressApi);

//for user get api
router.get("/get-user-data", getUserData);

// for contect form submit
router.post("/contect-submit", submitContectApi);

// for addmin addProducts
router.post("/addProducts", upload.array("images"), addProduct);

//for get contactform data
router.get("/contectNotifications", getContactNotification);

//for delete contact form
router.post("/delete-contactform", deleteContactForm);

// for get user form data
router.post("/getuserformdata", getUserDataById);

//for send reply of contact form
router.post("/sendReplyContactform", sendReplyContactform);

//for send email to all users from admin
router.post("/sendEmailFromAdmin", sendEmailFromAdmin);

//for get products data
router.get("/getProductsData", getProductsData)

//for delete product 
router.post("/deleteProduct/:id", deleteProductAdmin)


// for add to cart
router.post("/addToCart", addToCart)

// for removetocart
router.post("/removeToCart", removeToCart)


// for razopy payment 
router.post("/create-order", RazopayPayment)
module.exports = router;
