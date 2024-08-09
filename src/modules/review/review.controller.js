import reviewModel from "../../../db/models/review.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import productModel from '../../../db/models/product.model.js';
import orderModel from "../../../db/models/order.model.js";





// ================================  createReview ================================================
export const createReview = asyncHandler(async (req, res, next) => {
    const { comment, rate } = req.body
    const { productId } = req.params

    const product = await productModel.findOne({ _id: productId })
    if (!product) {
        return next(new AppError("product not exist", 404))
    }

    // const reviewExist = await reviewModel.findOne({ user: req.user._id, productId })
    // if (reviewExist) {
    //     return next(new AppError("already reviewed it before", 400))
    // }

    const order = await orderModel.findOne({ createdBy: req.user._id, "products.productId": productId })
    if (!order) {
        return next(new AppError("you can't review this product", 400))
    }


    const review = await reviewModel.create({ productId, comment, rate, user: req.user._id })

    // const reviews = await reviewModel.find({ productId })

    // let sum = 0
    // for (const review of reviews) {
    //     sum += review.rate
    // }

    // product.reteAvg = sum / reviews.length

    let sum = product.reteAvg * product.reteNum
    sum += rate
    product.reteAvg = sum / (product.reteNum + 1)
    product.reteNum += 1
    await product.save()

    res.status(201).json({ status: "done", review })

})






// ================================  deleteReview ================================================
export const deleteReview = asyncHandler(async (req, res, next) => {

    const { id } = req.params


    const review = await reviewModel.findOneAndDelete({ _id: id, user: req.user._id })
    if (!review) {
        return next(new AppError("review not exist", 404))
    }

    const product = await productModel.findOne({ _id: review.productId })
    let sum = product.reteAvg * product.reteNum
    sum -= review.rate
    product.reteAvg = sum / (product.reteNum - 1)
    product.reteNum -= 1
    await product.save()

    res.status(201).json({ status: "done", review })

})
