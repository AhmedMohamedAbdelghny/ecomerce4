import mongoose, { Types } from "mongoose";


const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "code is required"],
        trim: true,
        minLength: [3, "code must be at least 3 characters"],
        maxLength: [32, "code must be at most 32 characters"],
        lowercase: true,
    },
    amount: {
        type: Number,
        required: [true, "amount is required"],
        min: [1, "amount must be at least 3 characters"],
        max: [100, "amount must be at most 32 characters"],
        lowercase: true,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "createdBy is required"],
    },
    fromDate: {
        type: Date,
        required: [true, "fromDate is required"],
    },
    toDate: {
        type: Date,
        required: [true, "fromDate is required"],
    },
    usedBy: [{
        type: Types.ObjectId,
        ref: "user",
        required: [true, "createdBy is required"],
    }],
}, {
    timestamps: true,
    versionKey: false,
})


const couponModel = mongoose.model("coupon", couponSchema)

export default couponModel;
