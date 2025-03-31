import express from "express";
import {
  authenticateUser,
  createUserAccount,
  getCurrentUserProfile,
  signOutUser,
  updateUserProfile,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth.middleware";
import upload from "../utils/multer.js";
import { validateSignin,validateSignup } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/signup",validateSignup, createUserAccount);
router.post("/signin",validateSignin, authenticateUser);
router.post("/signout", signOutUser);

// profile routes
router.get("/profile", isAuthenticated, getCurrentUserProfile);
router.patch(
  "/profile",
  isAuthenticated,
  upload.single("avatar"),
  updateUserProfile
);

export default router;
