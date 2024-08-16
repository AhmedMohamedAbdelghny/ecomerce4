import orderModel from "../../../db/models/order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import productModel from '../../../db/models/product.model.js';
import couponModel from './../../../db/models/coupon.model.js';
import cartModel from "../../../db/models/cart.model.js";
import { createInvoice } from "../../utils/pdf.js";
import { sendEmail } from "../../service/sendEmail.js";
import { payment } from "../../utils/payment.js";
import Stripe from "stripe";





// ================================  createOrder ================================================
export const createOrder = asyncHandler(async (req, res, next) => {
    const { productId, quantity, paymentMethod, phone, address, couponCode } = req.body

    if (couponCode) {
        const coupon = await couponModel.findOne({
            code: couponCode,
            used: { $nin: [req.user._id] },
        })
        if (!coupon || coupon.toDate < Date.now()) {
            return next(new AppError("coupon not exist or expired", 404))
        }
        req.body.coupon = coupon
    }

    let products = []
    let flag = false
    if (productId) {
        products = [{ productId, quantity }]
    } else {
        const cart = await cartModel.findOne({ user: req.user._id })

        if (!cart.products.length) {
            return next(new AppError("select any product to order", 404))
        }
        products = cart.products
        flag = true
    }

    let finalProducts = []
    let subPrice = 0
    for (let product of products) {
        const checkProduct = await productModel.findOne({ _id: product.productId, stock: { $gt: product.quantity } })
        if (!product) {
            return next(new AppError("product not exist or out of stock", 404))
        }
        if (flag) {
            product = product.toObject()
        }

        product.title = checkProduct.title
        product.price = checkProduct.subPrice
        product.finalPrice = product.price * product.quantity
        subPrice += product.finalPrice
        finalProducts.push(product)
    }


    const order = await orderModel.create({
        createdBy: req.user._id,
        products: finalProducts,
        subPrice,
        couponId: req.body?.coupon?._id,
        totalPrice: subPrice - (subPrice * ((req.body?.coupon?.amount || 0) / 100)),
        phone,
        address,
        paymentMethod,
        status: paymentMethod == "cash" ? "placed" : "waitPayment"
    })


    for (const product of finalProducts) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -product.quantity } })
    }

    if (req.body?.coupon) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, { $push: { usedBy: req.user._id } })
    }

    if (flag) {
        await cartModel.updateOne({ user: req.user._id }, { products: [] })
    }


    //create pdf
    // const invoice = {
    //     shipping: {
    //         name: req.user.name,
    //         address: req.user.address,
    //         city: "San Francisco",
    //         state: "CA",
    //         country: "US",
    //         postal_code: 94111
    //     },
    //     items: order.products,
    //     subtotal: order.subPrice * 100,
    //     paid: order.totalPrice * 100,
    //     invoice_nr: order._id,
    //     date: order.createdAt,
    //     coupon: req.body?.coupon?.amount
    // };

    // await createInvoice(invoice, "invoice.pdf");

    // await sendEmail(req.user.email, "order", "order", [
    //     {
    //         path: "invoice.pdf",
    //         content_type: "application/pdf",
    //     }, {
    //         path: "route.jpeg",
    //         content_type: "image/png"
    //     }
    // ])

    if (paymentMethod == "card") {
        const stripe = new Stripe(process.env.secret_key)

        const session = await payment({
            stripe,
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: req.user.email,
            metadata: {
                orderId: order._id.toString(),
            },
            success_url: `${req.protocol}://${req.headers.host}/orders/success/${order._id}`,
            cancel_url: `${req.protocol}://${req.headers.host}/orders/cancel/${order._id}`,
            line_items: order.products.map((product) => {
                return {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: product.title,
                        },
                        unit_amount: product.finalPrice * 100,
                    },
                    quantity: product.quantity,
                }
            })
        })
        return res.status(201).json({ status: "done", order, url: session.url })

    }


    res.status(201).json({ status: "done", order })

})



export const webhook = async (req, res) => {
    const stripe = new Stripe(process.env.secret_key)
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    const { orderId } = event.data.object.metadata
    if (event.type == "checkout.session.completed") {
        await orderModel.findOneAndUpdate({ _id: orderId }, { status: "placed" }, { new: true })
        return res.status(200).json({ status: "done" })
    }
    await orderModel.findOneAndUpdate({ _id: orderId }, { status: "rejected" }, { new: true })
    return res.status(400).json({ status: "fail" })




}


// ================================  cancelOrder ================================================
export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { reason } = req.body
    const { id } = req.params



    const order = await orderModel.findOneAndUpdate({ _id: id, createdBy: req.user._id }, {
        reason,
        cancelledBy: req.user._id,
        status: "canceled"
    })



    for (const product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: product.quantity } })
    }

    if (order?.couponId) {
        await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } })
    }

    res.status(201).json({ status: "done", order })

})
