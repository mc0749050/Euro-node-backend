const User = require('../models/userSchema');
const product = require('../models/productSchema');


exports.addToCart = async (req, res) => {
    try {
    const {productid, userid} = req.body;

    const userData = await User.findOne({_id:userid})
    const productData = await product.findOne({_id:productid})

   userData.cart.push(productData);

    // Save the updated user document
    await userData.save();

    return res.status(201).json({ message: "Product added to cart" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding product to cart" });
    }
}


// for remove from the cart 

exports.removeToCart = async (req, res) => {
    try {
    const {productids, userid} = req.body;

    const userData = await User.findOne({_id:userid})

     // Filter out the product from the user's cart based on _id
     userData.cart = userData.cart.filter(item => !productids.includes(item._id.toString()));

    // Save the updated user document
    await userData.save();

    return res.status(201).json({ message: "Product removed from cart" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing product from cart" });
    }
}
