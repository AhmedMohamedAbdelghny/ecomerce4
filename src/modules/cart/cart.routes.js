import express from "express";
import * as CC from "./cart.controller.js";
import { multerHost, validExtensions } from '../../middleware/multer.js';
import { validation } from '../../middleware/validation.js';
import *  as CV from "./cart.validation.js";
import { auth } from '../../middleware/auth.js';
const cartRouter = express.Router();



cartRouter.post("/",
    validation(CV.createCart),
    auth(),
    CC.createCart)

cartRouter.patch("/",
    validation(CV.removeCart),
    auth(),
    CC.removeCart)
cartRouter.put("/",
    validation(CV.clearCart),
    auth(),
    CC.clearCart)

    






export default cartRouter;
