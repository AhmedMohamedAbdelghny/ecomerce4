
import joi from 'joi';
import { generalFiled } from '../../utils/generalFields.js';


export const createOrder = {
    body: joi.object({
        productId: generalFiled.id,
        quantity: joi.number().integer(),
        paymentMethod: joi.string().valid("cash", "card").required(),
        phone: joi.string().required(),
        address: joi.string().required(),
        couponCode: joi.string()
    }),
    headers: generalFiled.headers.required(),

}

export const cancelOrder = {
    body: joi.object({
        reason: joi.string().required(),
    }),
    params: joi.object({
        id: generalFiled.id,
    }),
    headers: generalFiled.headers.required(),

}

