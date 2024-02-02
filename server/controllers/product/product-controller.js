const express = require("express");
const router = express.Router();

/* PRODUCT MODEL IMPORT */
const Product = require("../../models/Product");

/* CREATE PRODUCT */
router.post("/", async (req, res, next) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(404).json({
      message: "Product name and price is required",
    });
  }
  try {
    const newProduct = await Product.create({
      name,
      price
    });
    res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
});

/* GET PRODUCTS */
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    if (!products.length) {
      return res.status(404).json({
        message: "No Products Found",
      });
    }
    res.status(200).json({
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

/* GET PRODUCT BY NAME */
router.get("/q", async (req, res, next) => {
  try {
    const productName = req.query.productName;

    if (!productName) {
      return res.status(400).json({
        message: "Product name is required as a query parameter",
      });
    }

    /* HANDLING CASE INSENSITIVE SEARCH */
    const searchResult = new RegExp(productName, "i");

    const productByName = await Product.find({
      name: { $regex: searchResult },
    }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      data: productByName,
    });
  } catch (error) {
    next(error);
  }
});

/* GET PRODUCT BY ID */
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const productById = await Product.findById(id);

    /* FOR INVALID PRODUCT ID */
    if (!productById) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      data: productById,
    });
  } catch (error) {
    next(error);
  }
});

/* UPDATE PRODUCT */
router.put("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, price, userId } = req.body;

    /* PRODUCT AUTHORIZATION */
    // const product = await Product.findById(productId);

    // console.log(product.userId)
    // if (!product || product.userId.toString() !== userId) {
    //   return res.status(403).json({
    //     message: "Unauthorized: You cannot update this product.",
    //   });
    // }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price },
      { new: true }
    );
    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

/* Delete a product by ID */
router.delete("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
