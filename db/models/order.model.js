import mongoose, { Types } from "mongoose";


const orderSchema = new mongoose.Schema({
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "createdBy is required"],
    },
    products: [{
        title: { type: String, required: [true, "quantity is required"], },
        productId: { type: Types.ObjectId, ref: "product", required: [true, "productId is required"], },
        quantity: { type: Number, required: [true, "quantity is required"], },
        price: { type: Number, required: [true, "quantity is required"], },
        finalPrice: { type: Number, required: [true, "quantity is required"], },
    }],
    subPrice: { type: Number, required: [true, "quantity is required"], },
    couponId: { type: Types.ObjectId, ref: "coupon" },
    totalPrice: { type: Number, required: [true, "quantity is required"], },
    address: { type: String, required: [true, "quantity is required"], },
    phone: { type: String, required: [true, "quantity is required"], },
    paymentMethod: { type: String, required: [true, "quantity is required"], enum: ["cash", "card"] },
    status: { type: String, enum: ["placed", "waitPayment", "onWay", "delivered", "canceled", "rejected"] },
    cancelledBy: {
        type: Types.ObjectId,
        ref: "user",
    },
    reason: String
}, {
    timestamps: true,
    versionKey: false,
})


const orderModel = mongoose.model("order", orderSchema)

export default orderModel;
