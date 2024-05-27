const { default: mongoose } = require("mongoose")
const Order = require("../model/Order")

class OrderController {

    async createOrder(req, res) {
        try {
            const user = req.user
            const cart = req.body
            if (cart.isEmpty) {
                return res.status(400).send("Empty cart")
            }
            const data = { customer: user.userId, order: [] }
            data.order = cart.map(item => {
                return { ...item, status: "New" }
            })

            await Order.create(data)
            return res.status(201).send("Order created")
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }
    }

    async getCustomerOrder(req, res) {
        try {
            const user = req.user
            const data = await Order.find({ customer: user.userId }).populate("order.product.seller", "fullName")
            return res.status(200).send(data)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }
    }

    async getSellerOrder(req, res) {
        try {
            const user = req.user
            const selectedSellers = await Order.aggregate([
                {
                    $unwind: "$order"
                },
                {
                    $match: { "order.product.seller": mongoose.Types.ObjectId(user.userId) }
                },
                {
                    $group: {
                        _id: "$_id",
                        customer: {$first : "$customer"},
                        order: { $push: { product: "$order.product", quantity: "$order.quantity", status: "$order.status" } },
                        createdAt: {$first: "$createdAt"} ,
                        updatedAt: {$first: "$updatedAt"}
                    }
                }
            ])

            const mappedData = selectedSellers.map(o => new Order(o))
            const data = await Order.populate(mappedData, {path: "customer", select: "fullName address"})
            return res.status(200).send(data)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }
    }

    async changeOrderStatus(req, res) {
        try {
            const orderId = req.params.orderId
            const productId = req.params.productId
            const status = req.query.status
            const validStat = ["Shipped", "Canceled", "Accept", "Reject"]
            if (!validStat.includes(status)) {
                return res.status(400).send("Invalid status")
            }

            const filter = {
                _id: orderId,
                "order.product._id": productId

            }
            const update = {
                $set: { "order.$.status": status }
            }

            await Order.findOneAndUpdate(filter, update)
            return res.status(200).send("Status update complete")
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }
    }
}


module.exports = new OrderController();