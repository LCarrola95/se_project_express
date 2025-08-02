const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/custom-errors");

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId.toString()) {
        return next(
          new ForbiddenError("You do not have permission to delete this item.")
        );
      }

      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.status(200).send({
          message: "Clothing item deleted successfully.",
          deletedItem,
        })
      );
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Clothing item not found."));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID."));
      }

      return next(err);
    });
};

const addLike = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.likes.includes(userId)) {
        return next(new BadRequestError("You have already liked this item."));
      }

      const updatedItem = {
        ...item.toObject(),
        likes: [...item.likes, userId],
      };
      return ClothingItem.findByIdAndUpdate(itemId, updatedItem, {
        new: true,
      }).then(() => res.status(200).send(updatedItem));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Clothing item not found."));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID."));
      }
      return next(err);
    });
};

const deleteLike = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.likes.includes(userId)) {
        return next(new BadRequestError("You have not liked this item."));
      }

      const updatedItem = {
        ...item.toObject(),
        likes: item.likes.filter(
          (like) => like.toString() !== userId.toString()
        ),
      };
      return ClothingItem.findByIdAndUpdate(itemId, updatedItem, {
        new: true,
      }).then(() => res.status(200).send(updatedItem));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Clothing item not found."));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID."));
      }
      return next(err);
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  addLike,
  deleteLike,
};
