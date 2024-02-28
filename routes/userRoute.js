const express = require("express");
const router = express.Router();
const User = require('../models/userModel');

router.post("/register", (req, res) => {
    User.find({ email: req.body.email }, (err, docs) => {
        if (docs.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                isAdmin: false // Assuming default isAdmin value
            };
            User.create(newUser, (err, user) => {
                if (!err) {
                    res.send('User registration successful');
                } else {
                    res.status(500).json({ message: 'Something went wrong' });
                }
            });
        }
    });
});

router.post("/login", (req, res) => {
    User.find({ email: req.body.email, password: req.body.password }, (err, docs) => {
        if (docs.length > 0) {
            const user = {
                name: docs[0].name,
                _id: docs[0]._id,
                email: docs[0].email,
                isAdmin: docs[0].isAdmin
            };
            res.send(user);
        } else {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
    });
});

router.post("/update", (req, res) => {
    const { userId, updatedUser } = req.body;
    User.findByIdAndUpdate(userId, updatedUser, (err) => {
        if (err) {
            return res.status(400).json({ message: 'Something went wrong' + err });
        } else {
            res.send('User details updated successfully');
        }
    });
});

router.get("/getallusers", (req, res) => {
    User.find({}, (err, docs) => {
        if (err) {
            return res.status(400).json({ message: 'Something went wrong' });
        } else {
            res.send(docs);
        }
    });
});

router.post("/deleteuser", (req, res) => {
    User.findByIdAndRemove(req.body.userId, (err) => {
        if (err) {
            return res.status(400).json({ message: 'Something went wrong' });
        } else {
            res.send('User deleted successfully');
        }
    });
});

module.exports = router;
