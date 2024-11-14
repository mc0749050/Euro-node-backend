const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZOPAY_KEY,
  key_secret: process.env.RAZOPAY_SECRET,
});

exports.RazopayPayment  = async (req, res) => {
    const { amount, currency = "INR" } = req.body;

    try {
      const options = {
        amount: amount * 100, // Convert amount to paise (smallest currency unit)
        currency,
        receipt: `receipt_order_${Date.now()}`,
      };
  
      const order = await razorpay.orders.create(options);
      res.status(200).json({ orderId: order.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}