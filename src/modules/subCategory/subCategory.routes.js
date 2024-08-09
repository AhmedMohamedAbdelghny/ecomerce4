import express from "express";
import * as CC from "./subCategory.controller.js";
import { multerHost, validExtensions } from '../../middleware/multer.js';
import { validation } from '../../middleware/validation.js';
import *  as CV from "./subCategory.validation.js";
import { auth } from '../../middleware/auth.js';
const subCategoryRouter = express.Router({ mergeParams: true });



subCategoryRouter.post("/",
    multerHost(validExtensions.image).single("image"),
    validation(CV.createSubCategory),
    auth(),
    CC.createSubCategory)


subCategoryRouter.get("/", CC.getSubCategories)







export default subCategoryRouter;
