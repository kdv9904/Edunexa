import express from "express";
import isAuth from './../middleware/isAuth.js';
import { createReview, getReviewById, getReviews } from "../controller/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/createreview",isAuth, createReview)
reviewRouter.get("/getreview", getReviews);
reviewRouter.get("/:id", getReviewById); 

export default reviewRouter;