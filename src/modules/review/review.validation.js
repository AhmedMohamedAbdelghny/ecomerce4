
import joi from 'joi';
import { generalFiled } from '../../utils/generalFields.js';


export const createReview = {
    body: joi.object({
        rate: joi.number().integer().min(1).max(5).required(),
        comment: joi.string().required(),
    }),
    params: joi.object({
        productId: generalFiled.id.required(),
    }),

    headers: generalFiled.headers.required(),
}


export const deleteReview = {

    params: joi.object({
        id: generalFiled.id.required(),
    }),
    headers: generalFiled.headers.required(),
}

