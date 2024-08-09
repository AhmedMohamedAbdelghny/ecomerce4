import express from "express";
import * as CC from "./product.controller.js";
import reviewRouter from "../review/review.routes.js";
import { multerHost, validExtensions } from '../../middleware/multer.js';
import { validation } from '../../middleware/validation.js';
import *  as CV from "./product.validation.js";
import { auth } from '../../middleware/auth.js';
import wishListRouter from "../wishList/wishList.routes.js";
const productRouter = express.Router({ mergeParams: true });

productRouter.use("/:productId/reviews", reviewRouter)
productRouter.use("/:productId/wishList", wishListRouter)

productRouter.post("/",
    multerHost(validExtensions.image).fields([
        { name: "image", maxCount: 1 },
        { name: "coverImages", maxCount: 3 },
    ]),
    validation(CV.createProduct),
    auth(),
    CC.createProduct)


productRouter.get("/", CC.getProducts)










export default productRouter;
