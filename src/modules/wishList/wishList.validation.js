
import joi from 'joi';
import { generalFiled } from '../../utils/generalFields.js';


export const createWishList = {
    params: joi.object({
        productId: generalFiled.id.required(),
    }),
    headers: generalFiled.headers.required(),

}


