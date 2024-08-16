import mongoose from "mongoose";


const connectionDB = async () => {
    return await mongoose.connect(process.env.EcommerceC42Sat)
        .then(() => {
            console.log(`connected to database on ${process.env.EcommerceC42Sat}`)
        }).catch((err) => {
            console.log({ msg: "fail to connect", err })
        })
}

export default connectionDB