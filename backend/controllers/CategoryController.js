const Category = require("../model/Category");
const {Product} = require("../model/Product");

class CategoryController {
    async getAllCategories(req, res) {
        try{
            const categories = await Category.find()
            let resultCategories = []
            
            for(let item of categories){
                item = await checkUpdatable(item)
                resultCategories.push(item)
            }
            res.status(200).send(resultCategories)
        }catch(err){
            console.log(err)
            res.sendStatus(500)
        }
    }

    async getCategoryWithParents(req, res) {
        try{
            let {categoryId} = req.params
            let data = await Category.findById(categoryId)
            data = await checkUpdatable(data)
            categoryId = data.parentCategoryId
            let category = [data]
            while (categoryId !== null) {
                const data = await Category.findById(categoryId)
                category.push(data)
                categoryId = data.parentCategoryId
            }
            res.status(200).send(category)
        }catch(err){
            console.log(err)
            res.sendStatus(500)
        }
    }

    async addCategory(req, res) {
        let name = ""
        try {
            const category = req.body
            name = category.name
            const attributeNameList = await getAllAttributesOfCategory(category)
            let dupplicateFlag = false;
            category?.attributes.forEach(element => {
                if(attributeNameList?.includes(element.name)){
                    dupplicateFlag = true
                }
            });
            if(dupplicateFlag){
                return res.sendStatus(400)
            }
            await Category.create(category)
            res.sendStatus(201)
        } catch (err) {
            console.log(err)
            if(err.message === `E11000 duplicate key error collection: test.categories index: name_1 dup key: { name: "${name}" }`){
                return res.sendStatus(400)
            }
            res.sendStatus(500)
        }
    }

    async updateCategory(req, res) {
        let name = ""
        try{
            const {categoryId} = req.params
            const category = req.body

            name = category.name
            let attributeNameList = await getAllAttributesOfCategory(category) ?? []
            attributeNameList = Array.from(attributeNameList)
            let dupplicateFlag = false;
            category?.attributes.forEach(element => {
                console.log(attributeNameList)
                console.log(typeof(attributeNameList))
                if(attributeNameList?.includes(element.name)){
                    dupplicateFlag = true
                }
            });

            if(dupplicateFlag){
                return res.sendStatus(400)
            }

            await Category.findByIdAndUpdate( categoryId, category)
            res.sendStatus(201)
        }catch (err){
            console.log(err)
            if(err.message === `E11000 duplicate key error collection: test.categories index: name_1 dup key: { name: "${name}" }`){
                return res.sendStatus(400)
            }
            res.sendStatus(500)
        }
    }

    async deleteCategory(req, res) {
        try{
            const {categoryId} = req.params
            await Category.findByIdAndDelete(categoryId)
            res.sendStatus(200)
        }catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    }
}


    // support functions
    async function getCategoryIdAndChildrenCategoriesId(categoryId){
        let categoryIdList = [categoryId]

        let childrenCategoryIdList = await Category.find({parentCategoryId: categoryId}, "_id")
        
        while (childrenCategoryIdList.length != 0) {
            const currentCatId = childrenCategoryIdList.at(0)._id
            categoryIdList.push(currentCatId)

            const currentChildrenIdList = await Category.find({parentCategoryId: currentCatId}, "_id")
            childrenCategoryIdList = childrenCategoryIdList.concat(currentChildrenIdList)
            childrenCategoryIdList.shift()
        }
        return categoryIdList
    }

    async function checkUpdatable(item){
        const haveParent = await Category.exists({parentCategoryId: item._id})
        let updatable = !haveParent
        if(updatable){
            const haveProduct = await Product.exists({category: item._id})
            updatable = !haveProduct
        }
        item.updatable = updatable;
        return item;
    }
    
    async function getAllAttributesOfCategory(category) {
        let allAttributesName = []
        while(category.parentCategoryId){
            category = await Category.findById(category.parentCategoryId);
            category.attributes.forEach(element => {
                allAttributesName.push(element.name)
            });
        }
        return allAttributesName
    }
 
module.exports = new CategoryController();
module.exports.getCategoryIdAndChildrenCategoriesId = getCategoryIdAndChildrenCategoriesId