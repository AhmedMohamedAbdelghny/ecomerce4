import express from "express";
import * as CC from "./coupon.controller.js";
import { multerHost, validExtensions } from '../../middleware/multer.js';
import { validation } from '../../middleware/validation.js';
import *  as CV from "./coupon.validation.js";
import { auth } from '../../middleware/auth.js';
const couponRouter = express.Router();



couponRouter.post("/",
    multerHost(validExtensions.image).single("image"),
    validation(CV.createCoupon),
    auth(),
    CC.createCoupon)

    
couponRouter.put("/:id",
    multerHost(validExtensions.image).single("image"),
    validation(CV.updateCoupon),
    auth(),
    CC.updateCoupon)






export default couponRouter;
