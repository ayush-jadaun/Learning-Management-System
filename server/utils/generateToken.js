import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  if (!user || !user._id) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user data" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === "production", // Only secure in production
    })
    .json({
      success: true, 
      message,
      user,
      token,
    });
};
