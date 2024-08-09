import express from "express";
import * as CC from "./brand.controller.js";
import { multerHost, validExtensions } from '../../middleware/multer.js';
import { validation } from '../../middleware/validation.js';
import *  as CV from "./brand.validation.js";
import { auth } from '../../middleware/auth.js';
const brandRouter = express.Router();



brandRouter.post("/",
    multerHost(validExtensions.image).single("image"),
    validation(CV.createBrand),
    auth(),
    CC.createBrand)






export default brandRouter;
