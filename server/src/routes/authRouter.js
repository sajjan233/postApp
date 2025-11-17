import express from "express";
import { registerUser, registerStep1, registerStep2, loginUser, getProfile, forgotPassword, resetPassword } from "../fetchers/user/index.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register/step1", registerStep1);
router.post("/register/step2", registerStep2);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.get("/me", authMiddleware, getProfile);

export default router;
