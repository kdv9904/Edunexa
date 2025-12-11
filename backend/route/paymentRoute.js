import express from "express"
import { checkEnrollment, RazorpayOrder, verifyPayment } from "../controller/orderController.js";

const paymentRouter = express.Router();

paymentRouter.post("/razorpay-order",RazorpayOrder);
paymentRouter.post("/verify-payment",verifyPayment);
paymentRouter.post('/check-enrollment', checkEnrollment);

export default paymentRouter;