const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  addLike,
  deleteLike,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.get("/", getClothingItems);
router.post("/", auth, createClothingItem);
router.delete("/:itemId", auth, deleteClothingItem);
router.put("/:itemId/likes", auth, addLike);
router.delete("/:itemId/likes", auth, deleteLike);

module.exports = router;
