const router = require("express").Router();

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { NotFoundError } = require("../utils/custom-errors");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res, next) => next(new NotFoundError("Requested resource not found")));

module.exports = router;
