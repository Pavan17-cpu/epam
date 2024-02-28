const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/products.json");

let productsData = [];

// Helper function to save data to JSON file
const saveDataToFile = () => {
    fs.writeFileSync(filePath, JSON.stringify(productsData, null, 2), "utf8");
};

// Helper function to load data from JSON file
const loadDataFromFile = () => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading products data:", error);
        return [];
    }
};

const Product = {
    // Initialize reviews property as an empty array
    reviews: [],
    find: (query, callback) => {
        const filteredProducts = productsData.filter(product => {
            for (const key in query) {
                if (product[key] !== query[key]) return false;
            }
            return true;
        });
        callback(null, filteredProducts);
    },
    // Add more methods as needed
};

// Initialize productsData with data from JSON file
productsData = loadDataFromFile();

module.exports = Product;
