const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/orders.json");

const saveDataToFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

const loadDataFromFile = () => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading orders data:", error);
        return [];
    }
};

const Order = {
    find: (query, callback) => {
        const filteredOrders = loadDataFromFile().filter(order => {
            for (const key in query) {
                if (order[key] !== query[key]) return false;
            }
            return true;
        });
        callback(null, filteredOrders);
    },

    findById: (orderId, callback) => {
        const order = loadDataFromFile().find(order => order._id === orderId);
        if (order) {
            callback(null, order);
        } else {
            callback("Order not found", null);
        }
    },

    create: (orderData, callback) => {
        const order = {
            _id: (new Date().getTime()).toString(),
            ...orderData
        };
        const orders = loadDataFromFile();
        orders.push(order);
        saveDataToFile(orders);
        callback(null, order);
    },


    getAllOrders: (callback) => {
        callback(null, loadDataFromFile());
    },
};

module.exports = Order;
