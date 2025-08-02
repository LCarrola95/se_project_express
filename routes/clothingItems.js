const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  addLike,
  deleteLike,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

router.get("/", getClothingItems);

router.post("/", auth, validateClothingItem, createClothingItem);

router.delete("/:itemId", auth, validateId, deleteClothingItem);

router.put("/:itemId/likes", auth, validateId, addLike);

router.delete("/:itemId/likes", auth, validateId, deleteLike);

module.exports = router;
