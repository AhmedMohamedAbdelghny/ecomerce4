import couponModel from "../../../db/models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { nanoid, customAlphabet } from "nanoid";
import cloudinary from '../../utils/cloudinary.js';
import slugify from "slugify";




// ================================  createCoupon ================================================
export const createCoupon = asyncHandler(async (req, res, next) => {
    const { code, amount, toDate, fromDate } = req.body

    const couponExist = await couponModel.findOne({ code: code.toLowerCase() })
    if (couponExist) {
        return next(new AppError("coupon already exist", 409))
    }


    const coupon = await couponModel.create({
        code,
        createdBy: req.user._id,
        amount, toDate, fromDate
    })

    res.status(201).json({ status: "done", coupon })

})


// ================================  updateCoupon ================================================
export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { code, amount, toDate, fromDate } = req.body
    const { id } = req.params
    const coupon = await couponModel.findOneAndUpdate({ _id: id, createdBy: req.user._id }, {
        code, amount, toDate, fromDate
    },{
        new:true
    })
    if (!coupon) {
        return next(new AppError("coupon not exist", 404))
    }


    res.status(201).json({ status: "done", coupon })

})
