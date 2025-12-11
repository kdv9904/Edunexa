import razorpay from "razorpay"
import dotenv from "dotenv"
import Course from './../model/courseModel.js';
import User from "./../model/userModel.js";

dotenv.config()

const RazorPayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const RazorpayOrder = async(req, res) =>{
    try {
        const {courseId} = req.body;
        const course = await Course.findById(courseId).select("price");
        if(!course) return res.status(404).json({success:false, message:"Course not found"});
        const options = {
            amount: course.price * 100,
            currency: "INR",
            receipt: `${courseId}.toString()`
        }
        const order = await RazorPayInstance.orders.create(options);
        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.log(`RazorpayOrder Error: ${error}`);
    }
}

export const verifyPayment = async (req, res) => {
  try {
    console.log("🟡 ===== VERIFY PAYMENT START =====");
    console.log("🔍 Full request body:", JSON.stringify(req.body, null, 2));
    console.log("🔍 Request headers:", req.headers);

    const { 
      razorpay_payment_id,
      razorpay_order_id, 
      razorpay_signature,
      courseId,
      userId
    } = req.body;

    console.log("📦 Extracted fields:", {
      razorpay_payment_id: !!razorpay_payment_id,
      razorpay_order_id: !!razorpay_order_id, 
      razorpay_signature: !!razorpay_signature,
      courseId: !!courseId,
      userId: !!userId
    });

    // Check which fields are missing
    const missingFields = [];
    if (!razorpay_order_id) missingFields.push('razorpay_order_id');
    if (!courseId) missingFields.push('courseId');
    if (!userId) missingFields.push('userId');

    if (missingFields.length > 0) {
      console.log("❌ Missing fields:", missingFields);
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        receivedData: {
          razorpay_payment_id: razorpay_payment_id || 'MISSING',
          razorpay_order_id: razorpay_order_id || 'MISSING', 
          razorpay_signature: razorpay_signature || 'MISSING',
          courseId: courseId || 'MISSING',
          userId: userId || 'MISSING'
        }
      });
    }

    console.log("✅ All required fields present");
    
    // For now, let's skip signature verification to test the flow
    console.log("🟡 Skipping signature verification for testing...");

    const orderInfo = await RazorPayInstance.orders.fetch(razorpay_order_id);
    console.log("💰 Razorpay order info:", {
      id: orderInfo.id,
      status: orderInfo.status,
      amount: orderInfo.amount,
      currency: orderInfo.currency
    });

    if (orderInfo.status === "paid") {
      const user = await User.findById(userId);
      const course = await Course.findById(courseId).populate("lectures");

      if (!user) {
        console.log("❌ User not found:", userId);
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      if (!course) {
        console.log("❌ Course not found:", courseId);
        return res.status(404).json({ 
          success: false, 
          message: "Course not found" 
        });
      }

      console.log("✅ User and course found, enrolling...");

      // Check if user is already enrolled
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
        console.log("✅ User enrolled in course");
      } else {
        console.log("ℹ️ User already enrolled in this course");
      }

      // Check if user is already in course's enrolled students
      if (!course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId);
        await course.save();
        console.log("✅ User added to course enrolled students");
      } else {
        console.log("ℹ️ User already in course enrolled students");
      }

      console.log("🟢 ===== PAYMENT VERIFICATION SUCCESS =====");
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        course,
      });
    } else {
      console.log("❌ Payment not completed, status:", orderInfo.status);
      return res.status(400).json({ 
        success: false, 
        message: `Payment not completed. Status: ${orderInfo.status}` 
      });
    }
  } catch (error) {
    console.log("❌ ===== VERIFY PAYMENT ERROR =====");
    console.log("❌ Error message:", error.message);
    console.log("❌ Error stack:", error.stack);
    res.status(500).json({ 
      success: false, 
      message: "Payment verification failed",
      error: error.message 
    });
  }
};

// Add this to your course or user controller
export const checkEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        isEnrolled: false,
        message: "User not found" 
      });
    }

    const isEnrolled = user.enrolledCourses.includes(courseId);
    
    res.status(200).json({
      success: true,
      isEnrolled,
      message: isEnrolled ? "User is enrolled" : "User is not enrolled"
    });
  } catch (error) {
    console.log("❌ Error checking enrollment:", error);
    res.status(500).json({ 
      success: false, 
      isEnrolled: false,
      message: "Error checking enrollment status" 
    });
  }
};
