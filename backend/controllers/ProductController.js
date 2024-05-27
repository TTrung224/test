const { Product } = require("../model/Product")
const path = require("path");
const fs = require("fs");
const Order = require("../model/Order");
const { default: mongoose } = require("mongoose");
const {getCategoryIdAndChildrenCategoriesId} = require("./CategoryController")

class ProductController {

    // NO AUTH
    async getAllProducts(req, res) {
        try {
            const limit = parseInt(req.query.maxPerPage)
            var pageNo = 1


            // Query products
            let query = {}

            let attributeList = {}

            if (req.query?.category !== "null") {
                let categoryList = await getCategoryIdAndChildrenCategoriesId(req.query?.category)
                query.category = { $in: categoryList }
            }
            if (req.query?.search !== "") {
                query.$or = [
                    { name: new RegExp(req.query.search, 'gisu') },
                    { description: new RegExp(req.query.search, 'gisu') }
                ]
            }

            //Get attribute list base on category and search input
            if (Object.keys(query).length != 0 && req.query.isUpdateAttribute == "true") {

                const tempProducts = await Product.find(query)

                //Get and group products' attribute 
                tempProducts.forEach(item => {
                    if (item?.attributes) {
                        item.attributes.forEach(attribute => {
                            if (Object.keys(attributeList).includes(attribute?.attribute?.name)) {
                                if (!attributeList[attribute?.attribute?.name].includes(attribute?.value)) {
                                    attributeList[attribute?.attribute?.name].push(attribute?.value)
                                }
                            } else {
                                attributeList[attribute?.attribute?.name] = [attribute?.value]
                            }
                        })
                    }
                })
            }

            if (req.query?.page) {
                pageNo = parseInt(req.query.page)
            }
            if (req.query?.attributes !== "") {
                query["attributes.value"] = { $in: req.query?.attributes.split(",") }
            }

            if (req.query?.minPrice !== "" && req.query.maxPrice !== "") {
                query.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice }
            } else if (req.query?.minPrice !== "") {
                query.price = { $gte: req.query.minPrice }
            } else if (req.query?.maxPrice !== "") {
                query.price = { $lte: req.query.maxPrice }
            }
            if (req.query?.minDate !== "" && req.query.maxDate !== "") {
                query.createdAt = { $gte: req.query.minDate, $lte: req.query.maxDate }
            } else if (req.query?.minDate !== "") {
                query.createdAt = { $gte: req.query.minDate }
            } else if (req.query?.minDate !== "") {
                query.createdAt = { $lte: req.query.maxDate }
            }

            let products
            let count
            var skip = (pageNo - 1) * (limit)
            if (Object.keys(query).length) {
                products = await Product.find(query).skip(skip).limit(limit).populate('category')
                count = await Product.find(query).count()
            } else {
                products = await Product.find().skip(skip).limit(limit).populate('category')
                count = await Product.count()
            }

            return res.status(200).send({ products: products, count: count, attributes: attributeList })
        } catch (error) {
            console.log(error)
            return res.sendStatus(500)
        }
    }

    async getProduct(req, res) {
        try {
            const productId = req.params.productId
            const product = await Product
                .findById(productId)
                .populate('category')
            res.status(200).send(product)
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    }

    // REQUIRE AUTH
    async getUserProducts(req, res) {
        try {
            const userId = req.params.userId

            if (req.user.userId !== userId) {
                return res.status(401).send("Unauthorized Request");
            }
            const products = await Product
                .find({ seller: userId })
                .populate('category')
            return res.status(200).send(products)
        } catch (error) {
            console.log(error)
            return res.sendStatus(500)
        }
    }

    async getProductStat(req, res) {
        try {
            const user = req.user
            const currentProducts = await Product.find({ seller: user.userId })

            // Check all orders too, in case current product has been deleted
            const data = await Order.aggregate([
                { $unwind: "$order" },
                { $match: { "order.product.seller": mongoose.Types.ObjectId(user.userId) } },
                {
                    $group: {
                        productId: { $first: "$order.product._id" },
                        name: { $first: "$order.product.name" },
                        imgName: { $first: "$order.product.imgName" },
                        quantity: { $sum: "$order.quantity" },
                        _id: "$order.status",
                        count: { $sum: 1 }
                    }
                }, {
                    $group: {
                        _id: "$productId",
                        name: { $first: "$name" },
                        imgName: { $first: "$imgName" },
                        quantity: { $sum: "$quantity" },
                        statistic: { $push: { status: "$_id", count: "$count" } }
                    }
                }
            ])

            currentProducts.forEach(p => {
                const index = data.findIndex(d => d._id.toString() === p._id.toString())
                if (index === -1) {
                    data.push({
                        _id: p._id,
                        name: p.name,
                        imgName: p.imgName,
                        quantity: 0,
                        statistic: []
                    })
                }else {
                    data[index].name = p.name
                }
            })

            return res.status(200).send(data)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }
    }


    async addProduct(req, res) {
        try {
            if (!req.file) {
                return res.status(500).send("Upload image failed")
            }

            const data = req.body

            if (data.productSeller !== req.user.userId) {
                return res.status(401).send("Unauthorized Request");
            }

            const newObject = {}
            newObject.seller = data.productSeller
            newObject.name = data.productName
            newObject.price = data.productPrice
            newObject.description = data.productDesc
            newObject.category = data.productCategory
            newObject.attributes = JSON.parse(data.productAttributes)


            await Product.create(newObject, (err, product) => {
                if (err) {
                    res.status(500).send("Create product failed")
                } else {
                    const imgName = processImage(req.file, product._id.toString())
                    product.imgName = imgName
                    product.save().then(p => res.status(201).send(product))
                }
            })
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    }


    async editProduct(req, res) {
        try {

            const newObject = {}
            const data = req.body

            if (data.productSeller !== req.user.userId) {
                return res.status(401).send("Unauthorized Request");
            }

            const productId = req.params.productId

            if (req.file) {
                const imgName = processImage(req.file, productId)
                if (imgName === null) {
                    res.status(500).send("Upload image failed")
                } else {
                    newObject.imgName = imgName
                }
            }

            newObject.name = data.productName
            newObject.price = data.productPrice
            newObject.description = data.productDesc
            newObject.attributes = JSON.parse(data.productAttributes)

            await Product.findByIdAndUpdate(productId, newObject)
            res.status(200).send("Product saved")

        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.productId
            const { seller } = await Product.findById(productId, 'seller')
            if (seller.toString() !== req.user.userId) {
                return res.status(401).send("unauthorized request");
            }


            // Don't delete images, because Order may store a copy of the product, so we
            // still need the image file to display it properly
            await Product.findByIdAndDelete(productId)

            return res.status(200).send("Delete Successful")
        } catch (error) {
            console.log(error)
            return res.sendStatus(500)
        }
    }
}

function processImage(file, productId) {
    const oldPath = file.path
    const imgName = `${productId}${path.extname(file.originalname)}`
    const newPath = path.join(__dirname, `../productImgs/${imgName}`);

    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.log(err.message)
            return "placeholder.png"
        }
    })

    return imgName
}

module.exports = new ProductController();