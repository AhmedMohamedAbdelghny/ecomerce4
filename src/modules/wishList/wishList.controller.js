import wishListModel from "../../../db/models/wishList.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import productModel from '../../../db/models/product.model.js';





// ================================  createWishList ================================================
export const createWishList = asyncHandler(async (req, res, next) => {
    const { productId } = req.params

    const product = await productModel.findOne({ _id: productId })
    if (!product) {
        return next(new AppError("product not exist ", 404))
    }

    const wishListExist = await wishListModel.findOne({ user: req.user._id })
    if (!wishListExist) {
        const wishList = await wishListModel.create({
            user: req.user._id,
            products: [productId]
        })
        return res.status(201).json({ status: "done", wishList })
    }


    await wishListExist.updateOne({ $addToSet: { products: productId } })

    res.status(201).json({ status: "done", wishList: wishListExist })

})




