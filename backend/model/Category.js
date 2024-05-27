const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true, require: true },
  parentCategoryId: { type: mongoose.Schema.Types.ObjectId, default: null },
  attributes: {
    type: Array, default: []
  },
  updatable: { type: Boolean }
});

module.exports = mongoose.model("category", categorySchema);