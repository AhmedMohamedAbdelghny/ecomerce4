import mongoose, { Types } from "mongoose";


const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, "comment is required"],
    },
    rate: {
        type: Number,
        required: [true, "rating is required"],
        min: 1,
        max: 5
    },
    user: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "createdBy is required"],
    },
    productId: {
        type: Types.ObjectId,
        ref: "product",
        required: [true, "productId is required"],
    },
}, {
    timestamps: true,
    versionKey: false,
})


const reviewModel = mongoose.model("review", reviewSchema)

export default reviewModel;
