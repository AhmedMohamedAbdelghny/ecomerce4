import subCategoryModel from "../../../db/models/subCategory.model.js";
import categoryModel from './../../../db/models/category.model.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { nanoid, customAlphabet } from "nanoid";
import cloudinary from '../../utils/cloudinary.js';
import slugify from "slugify";




// ================================  createSubCategory ================================================
export const createSubCategory = asyncHandler(async (req, res, next) => {
    const { name, } = req.body

    const categoryExist = await categoryModel.findById(req.params.categoryId)
    if (!categoryExist) {
        return next(new AppError("category not exist", 404))
    }
    const subCategoryExist = await subCategoryModel.findOne({ name: name.toLowerCase() })
    if (subCategoryExist) {
        return next(new AppError("subCategory already exist", 409))
    }

    if (!req.file) {
        return next(new AppError("image is required", 400))
    }

    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `EcommerceC42Mon/categories/${categoryExist.customId}/subCategories/${customId}`
    })

    const subCategory = await subCategoryModel.create({
        name,
        slug: slugify(name, {
            lower: true,
            replacement: "_"
        }),
        createdBy: req.user._id,
        category: req.params.categoryId,
        image: { secure_url, public_id },
        customId
    })

    res.status(201).json({ status: "done", subCategory })

})



// ================================  getSubCategories ================================================
export const getSubCategories = asyncHandler(async (req, res, next) => {
    const subCategories = await subCategoryModel.find({}).populate([
        { path: "category", },
        { path: "createdBy", },
    ])

    res.status(200).json({ status: "done", subCategories })

})
