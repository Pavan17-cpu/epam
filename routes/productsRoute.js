const express = require("express");
const router = express.Router();
const Product = require('../models/productModel');
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/products.json");

// Helper function to read and write data to JSON file
const saveDataToFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Helper function to load products data from JSON file
const loadDataFromFile = () => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading products data:", error);
        return [];
    }
};

router.get("/getallproducts", (req, res) => {
    const products = loadDataFromFile();
    res.send(products);
});

router.post("/getproductbyid", (req, res) => {
    const products = loadDataFromFile();
    const productId = req.body.productid;
    const product = products.find(product => product._id === productId);
    if (product) {
        res.send(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

router.post("/addreview", (req, res) => {
    const { review, productid, currentUser } = req.body;

    if (!currentUser) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const products = loadDataFromFile();
    const productIndex = products.findIndex(product => product._id === productid);

    if (productIndex !== -1) {
        const product = products[productIndex];
        // Ensure that the 'reviews' property is initialized as an empty array if it doesn't exist
        if (!product.reviews) {
            product.reviews = [];
        }
        const reviewModel = {
            name: currentUser.name,
            userid: currentUser._id,
            rating: review.rating,
            comment: review.comment
        };
        product.reviews.push(reviewModel);
        // Calculate average rating
        const totalRating = product.reviews.reduce((acc, curr) => acc + curr.rating, 0);
        product.rating = totalRating / product.reviews.length;
        // Update product in data and save to file
        products[productIndex] = product;
        saveDataToFile(products);
        res.send('Review submitted successfully');
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

router.post("/deleteproduct", (req, res) => {
    const productId = req.body.productid;
    const products = loadDataFromFile();
    const updatedProducts = products.filter(product => product._id !== productId);
    if (updatedProducts.length < products.length) {
        saveDataToFile(updatedProducts);
        res.send('Product deleted successfully');
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

router.post("/addproduct", (req, res) => {
    const { product } = req.body;
    const products = loadDataFromFile();
    product._id = (new Date().getTime()).toString(); // Generate unique id
    products.push(product);
    saveDataToFile(products);
    res.send('Product added successfully');
});

router.post("/updateproduct", (req, res) => {
    const { productid, updatedproduct } = req.body;
    const products = loadDataFromFile();
    const productIndex = products.findIndex(product => product._id === productid);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedproduct };
        saveDataToFile(products);
        res.send('Product updated successfully');
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

module.exports = router;
