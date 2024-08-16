import express from "express";
import * as OC from "./order.controller.js";
import { multerHost, validExtensions } from '../../middleware/multer.js';
import { validation } from '../../middleware/validation.js';
import *  as CV from "./order.validation.js";
import { auth } from '../../middleware/auth.js';
const orderRouter = express.Router();



orderRouter.post("/",
    validation(CV.createOrder),
    auth(),
    OC.createOrder)


orderRouter.patch("/:id",
    validation(CV.cancelOrder),
    auth(),
    OC.cancelOrder)



orderRouter.post('/webhook', express.raw({ type: 'application/json' }), OC.webhook);






export default orderRouter;
