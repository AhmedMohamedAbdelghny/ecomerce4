import express from "express";
import * as CC from "./category.controller.js";
import subCategoryRouter from './../subCategory/subCategory.routes.js';
import { multerHost, validExtensions } from './../../middleware/multer.js';
import { validation } from './../../middleware/validation.js';
import *  as CV from "./category.validation.js";
import { auth } from './../../middleware/auth.js';
const categoryRouter = express.Router({ caseSensitive: true });

categoryRouter.use("/:categoryId/subCategories", subCategoryRouter)

categoryRouter.post("/",
    multerHost(validExtensions.image).single("image"),
    validation(CV.createCategory),
    auth(),
    CC.createCategory)


categoryRouter.put("/:id",
    multerHost(validExtensions.image).single("image"),
    validation(CV.updateCategory),
    auth(),
    CC.updateCategory)


categoryRouter.delete("/:id",
    validation(CV.deleteCategory),
    auth(),
    CC.deleteCategory)

categoryRouter.get("/", CC.getCategories)






export default categoryRouter;
