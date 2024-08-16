import Stripe from "stripe";



export const payment = async ({
    stripe = new Stripe(process.env.secret_key),
    payment_method_types = ["card"],
    mode = "payment",
    customer_email,
    metadata = {},
    success_url,
    cancel_url,
    line_items = [],
    discounts = []

} = {}) => {

    stripe = new Stripe(process.env.secret_key)
    const session = stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        metadata,
        success_url,
        cancel_url,
        line_items,
        discounts

    })

    return session
}

// {
//     price_data: {
//         currency: "egp",
//         product_data: {
//             name: "T-shirt",
//         },
//         unit_amount: 200,
//     },
//     quantity: 1,
// },