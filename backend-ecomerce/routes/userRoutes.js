const express = require("express");
const {
  signUpUser,
  signInUser,
  getUser,
  changePassword,
  getUserById,
  updateUser,
  getShopInfo,
} = require("../controllers/userControllers");
const { verifyUser } = require("../middleware/middleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ data: "thanh cong" });
});
router.post("/signup", signUpUser);
router.post("/signin", signInUser);

router.route("/me").get([verifyUser], getUser);
router.route("/changepassword").post([verifyUser], changePassword);

router.route("/:id").put([verifyUser], updateUser);
router.get("/:id", getUserById);
router.get("/shop/:userId", getShopInfo);

module.exports = router;
