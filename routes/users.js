const router = require("express").Router();
const {
  login,
  createUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
