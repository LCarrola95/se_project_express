const router = require("express").Router();

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res, next) => {
  const err = new Error("Requested resource not found");
  err.statusCode = NOT_FOUND;
  next(err);
});

module.exports = router;
