
import joi from 'joi';
import { Types } from 'mongoose';
import { generalFiled } from '../../utils/generalFields.js';


export const createCategory = {
    body: joi.object({
        name: joi.string().min(3).max(32).required()
    }),
    file: generalFiled.file.required(),
    headers: generalFiled.headers.required(),

}

export const updateCategory = {
    body: joi.object({
        name: joi.string().min(3).max(32)
    }),
    file: generalFiled.file,
    params: joi.object({
        id: generalFiled.id.required(),
    }),
    headers: generalFiled.headers.required(),

}

export const deleteCategory = {
    params: joi.object({
        id: generalFiled.id.required(),
    }),
    headers: generalFiled.headers.required(),

}