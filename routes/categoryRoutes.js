import express from "express";
import { isAdmin, checktoken } from "./../middleware/authMiddleware.js";
import {
  categoryControlller,
  createCategoryController,
  deleteCategoryCOntroller,
  singleCategoryController,
  updateCategoryController,
} from "./../contollers/categoryController.js";

const router = express.Router();

//routes
// create category
router.post("/create-category",checktoken, isAdmin, createCategoryController);

//update category
router.put("/update-category/:id", checktoken, isAdmin, updateCategoryController);

//getALl category
router.get("/get-category", categoryControlller);

//single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete("/delete-category/:id", checktoken, isAdmin, deleteCategoryCOntroller);

export default router;