import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make sure your JWT is signed with { userId: user._id }
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;
