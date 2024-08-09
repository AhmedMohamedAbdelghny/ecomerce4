import mongoose, { Types } from "mongoose";


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: [3, "name must be at least 3 characters"],
        maxLength: [32, "name must be at most 32 characters"],
        lowercase: true,
    },
    slug: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: [3, "name must be at least 3 characters"],
        maxLength: [32, "name must be at most 32 characters"],
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, "name is required"],
        trim: true,
    },
    image: {
        secure_url: String,
        public_id: String
    },
    coverImages: [{
        secure_url: String,
        public_id: String
    }],
    customId: String,
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "createdBy is required"],
    },
    category: {
        type: Types.ObjectId,
        ref: "category",
        required: [true, "category is required"],
    },
    subCategory: {
        type: Types.ObjectId,
        ref: "subCategory",
        required: [true, "subCategory is required"],
    },
    brand: {
        type: Types.ObjectId,
        ref: "brand",
        required: [true, "brand is required"],
    },
    price: {
        type: Number,
        required: [true, "price is required"],
    },
    discount: {
        type: Number,
        default: 0
    },
    subPrice: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: [true, "stock is required"],
    },
    reteAvg: {
        type: Number,
        default: 0
    },
    reteNum: {
        type: Number,
        default: 0
    },


}, {
    timestamps: true,
    versionKey: false,
})




const productModel = mongoose.model("product", productSchema)

export default productModel;
