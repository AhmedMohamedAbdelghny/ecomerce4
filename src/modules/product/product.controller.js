import productModel from "../../../db/models/product.model.js";
import categoryModel from '../../../db/models/category.model.js';
import subCategoryModel from "../../../db/models/subCategory.model.js";
import brandModel from './../../../db/models/brand.model.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { nanoid, customAlphabet } from "nanoid";
import cloudinary from '../../utils/cloudinary.js';
import slugify from "slugify";
import { ApiFeatures } from "../../utils/apiFeatures.js";




// ================================  createProduct ================================================
export const createProduct = asyncHandler(async (req, res, next) => {
    const { title, description, category, subCategory, brand, price, discount, stock } = req.body
    //check category exist
    const categoryExist = await categoryModel.findById(category)
    if (!categoryExist) {
        return next(new AppError("category not exist", 404))
    }
    //check  subCategory exist
    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category })
    if (!subCategoryExist) {
        return next(new AppError("subCategory not exist", 404))
    }
    //check  brand exist
    const brandExist = await brandModel.findById(brand)
    if (!brandExist) {
        return next(new AppError("brand not exist", 404))
    }

    //check  product exist
    const productExist = await productModel.findOne({ title: title.toLowerCase() })
    if (productExist) {
        return next(new AppError("product already exist", 404))
    }

    let subPrice = price - price * ((discount || 0) / 100)

    //upload images
    if (!req.files) {
        return next(new AppError("image is required", 404))
    }
    const customId = nanoid(5)
    let list = []
    for (const file of req.files.coverImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `EcommerceC42Mon/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/coverImages`
        })
        list.push({ secure_url, public_id })
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: `EcommerceC42Mon/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/image`
    })
    const product = await productModel.create({
        title,
        slug: slugify(title, {
            lower: true,
            replacement: "_"
        }),
        description,
        category,
        subCategory,
        brand,
        price,
        discount,
        subPrice,
        createdBy: req.user._id,
        stock,
        image: { secure_url, public_id },
        images: list,
        customId
    })


    res.status(201).json({ status: "done", product })

})





export const getProducts = asyncHandler(async (req, res, next) => {


    const apiFeatures = new ApiFeatures(`productModel`.find(), req.query)
        .pagination()
        .filter()
        .sort()
        .select()
        .search()

    const products = await apiFeatures.mongooseQuery
    res.status(200).json({ status: "done", page: apiFeatures.page, products })


})