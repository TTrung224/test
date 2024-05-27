const mongoose = require("mongoose");
const { productSchema } = require("../model/Product")

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "account" },
    order: [{
        // store value in case product is deleted
        product: { type: productSchema, require: true },
        quantity: { type: Number, require: true },
        status: { type: String, require: true },
        _id: false
    }]
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);