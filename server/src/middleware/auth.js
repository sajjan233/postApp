// server/src/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../fetchers/user/user.js";
import Role from "../fetchers/role/role.js";

export const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers['x-auth-token'];
      if (!authHeader) return res.status(401).json({ error: "No token provided" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};




export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['x-auth-token']
    console.log("authHeader",authHeader);
    if (!authHeader)
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).populate("roleId");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = {
      id: user._id,
      role: user.roleId.slug,
    };

    next();
  } catch (err) {
    console.log("err",err);
    
    return res.status(401).json({ message: "Invalid Token", error: err.message });
  }
};
