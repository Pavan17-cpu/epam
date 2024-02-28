const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/users.json");

let usersData = [];

try {
    // Load existing data from JSON file
    usersData = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch (error) {
    console.error("Error reading users data:", error);
}

const saveDataToFile = () => {
    // Write data to JSON file
    fs.writeFileSync(filePath, JSON.stringify(usersData, null, 2), "utf8");
};

const User = {
    find: (query, callback) => {
        const filteredUsers = usersData.filter(user => {
            for (const key in query) {
                if (user[key] !== query[key]) return false;
            }
            return true;
        });
        callback(null, filteredUsers);
    },
    findByIdAndUpdate: (userId, newData, callback) => {
        const userIndex = usersData.findIndex(user => user._id === userId);
        if (userIndex !== -1) {
            usersData[userIndex] = { ...usersData[userIndex], ...newData };
            saveDataToFile();
            callback(null);
        } else {
            callback("User not found");
        }
    },
    findByIdAndRemove: (userId, callback) => {
        const userIndex = usersData.findIndex(user => user._id === userId);
        if (userIndex !== -1) {
            const deletedUser = usersData.splice(userIndex, 1)[0];
            saveDataToFile();
            callback(null, deletedUser);
        } else {
            callback("User not found", null);
        }
    },
    create: (userData, callback) => {
        const newUser = {
            _id: usersData.length + 1, // You may want to generate a unique ID here
            ...userData
        };
        usersData.push(newUser);
        saveDataToFile();
        callback(null, newUser);
    },
    // Add other methods as needed
};

module.exports = User;
