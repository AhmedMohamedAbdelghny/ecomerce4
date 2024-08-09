import categoryModel from "../../../db/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { nanoid, customAlphabet } from "nanoid";
import cloudinary from './../../utils/cloudinary.js';
import slugify from "slugify";
import subCategoryModel from "../../../db/models/subCategory.model.js";




// ================================  createCategory ================================================
export const createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body

    const categoryExist = await categoryModel.findOne({ name: name.toLowerCase() })
    if (categoryExist) {
        return next(new AppError("category already exist", 409))
    }

    if (!req.file) {
        return next(new AppError("image is required", 400))
    }

    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `EcommerceC42Mon/categories/${customId}`
    })
    req.filePath = `EcommerceC42Mon/categories/${customId}`



    const category = await categoryModel.create({
        name,
        slug: slugify(name, {
            lower: true,
            replacement: "_"
        }),
        createdBy: req.user._id,
        image: { secure_url, public_id },
        customId
    })
    req.data = {
        model: categoryModel,
        id: category._id
    }

    const x = 5
    x = 4

    res.status(201).json({ status: "done", category })

})



// ================================  updateCategory ================================================
export const updateCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const { id } = req.params

    const category = await categoryModel.findOne({ _id: id, createdBy: req.user._id })
    if (!category) {
        return next(new AppError("category not exist or you don't have permission", 409))
    }

    if (name) {
        if (name.toLowerCase() === category.name) {
            return next(new AppError("name match old name", 409))
        }
        if (await categoryModel.findOne({ name: name.toLowerCase() })) {
            return next(new AppError("category already exist", 409))
        }

        category.name = name.toLowerCase()
        category.slug = slugify(name, {
            lower: true,
            replacement: "_"
        })
    }

    if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `EcommerceC42Mon/categories/${category.customId}`

        })
        category.image = { secure_url, public_id }
    }


    await category.save()


    res.status(201).json({ status: "done", category })

})


// ================================  getCategories ================================================
export const getCategories = asyncHandler(async (req, res, next) => {
    const categories = await categoryModel.find({}).populate("subCategories")

    // let list = []
    // for (const category of categories) {
    //     const subCategories = await subCategoryModel.find({ category: category._id })
    //     // list.push({ category, subCategories })
    //     let newCategory = category.toObject()
    //     newCategory.subCategories = subCategories
    //     list.push(newCategory)

    // }
  

    res.status(200).json({ status: "done", categories })

})


// ================================  deleteCategory ================================================
export const deleteCategory = asyncHandler(async (req, res, next) => {

    //delete from db
    const category = await categoryModel.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id })
    if (!category) {
        return next(new AppError("category not exist or you don't have permission", 409))
    }

    await subCategoryModel.deleteMany({ category: req.params.id })

    //delete from cloudinary
    await cloudinary.api.delete_resources_by_prefix(`EcommerceC42Mon/categories/${category.customId}`)
    await cloudinary.api.delete_folder(`EcommerceC42Mon/categories/${category.customId}`)

    res.status(200).json({ status: "done" })

})