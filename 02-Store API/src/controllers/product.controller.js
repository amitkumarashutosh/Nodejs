import { Product } from "../models/product.model.js";

const getAllProducts = async (req, res) => {
  try {
    const { featured, name, company, sort, fields } = req.query;

    let queryObject = {};

    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
    }
    if (featured) {
      queryObject.featured = featured === "true" ? true : false;
    }
    if (company) {
      queryObject.company = company;
    }

    let result = Product.find(queryObject);

    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("createdAt");
    }

    if (fields) {
      const fieldsList = fields.split(",").join(" ");
      result = result.select(fieldsList);
    }

    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ products, count: products.length });
  } catch (error) {
    res.status(500).json({ msg: "something went wrong" });
  }
};

const getAllStaticProducts = async (req, res) => {
  try {
    const product = await Product.find({});
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ msg: "something went wrong" });
  }
};
export { getAllProducts, getAllStaticProducts };
