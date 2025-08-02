const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUpdateUser } = require("../middlewares/validation");

router.use(auth);

router.get("/me", getCurrentUser);

router.patch("/me", validateUpdateUser, updateUser);

module.exports = router;
