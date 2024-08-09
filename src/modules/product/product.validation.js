
import joi from 'joi';
import { Types } from 'mongoose';
import { generalFiled } from '../../utils/generalFields.js';


export const createProduct = {
    body: joi.object({
        title: joi.string().min(3).max(32).required(),
        description: joi.string().min(3),
        category: generalFiled.id.required(),
        subCategory: generalFiled.id.required(),
        brand: generalFiled.id.required(),
        price: joi.number().integer().required(),
        stock: joi.number().integer().required(),
        discount: joi.number().integer().min(1).max(100),
    }),
    files: joi.object({
        image: joi.array().items(generalFiled.file.required()).required(),
        coverImages: joi.array().items(generalFiled.file.required()).required(),
    }).required(),
    headers: generalFiled.headers.required(),

}

