const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51IYnC0SIR2AbPxU0EiMx1fTwzbZXLbkaOcbc2cXx49528d9TGkQVjUINJfUDAnQMVaBFfBDP5xtcHCkZG1n1V3E800U7qXFmGf")
const Order = require('../models/orderModel');
const { v4: uuidv4 } = require('uuid');


router.post("/placeorder", async (req, res) => {
    const { token, cartItems, currentUser, subtotal } = req.body;

    const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
    });

    const payment = await stripe.charges.create({
        amount: subtotal * 100,
        currency: 'inr',
        customer: customer.id,
        receipt_email: token.email
    }, {
        idempotencyKey: uuidv4()
    });

    if (payment) {
        const order = {
            _id: (new Date().getTime()).toString(),
            userid: currentUser._id,
            name: currentUser.name,
            email: currentUser.email,
            orderItems: cartItems,
            shippingAddress: {
                address: token.card.address_line1,
                city: token.card.address_city,
                country: token.card.address_country,
                postalCode: token.card.addres_zip
            },
            orderAmount: subtotal,
            transactionId: payment.source.id,
            isDelivered: false
        };

        Order.create(order, (err, newOrder) => {
            if (err) {
                console.error('Error placing order:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.send('Order Placed Successfully');
            }
        });
    } else {
        return res.status(400).json({ message: 'Payment failed' });
    }
});

router.post("/getordersbyuserid", (req, res) => {
    const userid = req.body.userid;
    Order.find({ userid }, (err, userOrders) => {
        if (err) {
            console.error('Error fetching orders by user ID:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.send(userOrders);
        }
    });
});

router.post("/getorderbyid", (req, res) => {
    const orderid = req.body.orderid;
    Order.findById(orderid, (err, order) => {
        if (err) {
            console.error('Error fetching order by ID:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else if (!order) {
            res.status(404).json({ message: 'Order not found' });
        } else {
            res.send(order);
        }
    });
});

router.get("/getallorders", (req, res) => {
    Order.getAllOrders((err, orders) => {
        if (err) {
            console.error('Error fetching all orders:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.send(orders);
        }
    });
});

module.exports = router;
