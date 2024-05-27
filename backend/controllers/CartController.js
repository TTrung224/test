const Account = require("../model/Account")

class CartController {
    async getCart(req, res) {
        try {
            const user = req.user
            const data = await Account.findById(user.userId, "cart").populate('cart.product')
            const cart = data.cart.filter(c => c.product !== null)
            res.status(200).send(cart)
        } catch (error) {
            console.log(error)
            res.sendStatus(200)
        }
    }

    async updateCart(req, res) {
        try {
            const user = req.user
            const data = req.body

            const cart = data.map(item => {
                return {product: item.product._id, quantity: item.quantity}
            })

            await Account.findByIdAndUpdate(user.userId, { cart: cart })
            return res.status(200).send("Cart updated successfully")
        } catch (error) {
            console.log(error)
            return res.sendStatus(500)
        }
    }
}

module.exports = new CartController();