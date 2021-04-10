const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsgsy.mongodb.net/kitchenOffice?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const foodCollection = client.db("kitchenOffice").collection("foods");
    app.get('/foods', (req, res) => {
        foodCollection.find({})
            .toArray((error, documents) => {
                res.send(documents)
            })
    })
    app.get('/foods/:category', (req, res) => {
        foodCollection.find({ category: req.params.category })
            .toArray((error, documents) => {
                res.send(documents)
            })
    })
    app.get('/food/:id', (req, res) => {
        foodCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((error, documents) => {
                res.send(documents)
            })
    })
    const orderCollection = client.db("kitchenOffice").collection("orders");
    app.post('/order', (req, res) => {
        console.log(req.body);
        const orderData = req.body;
        orderCollection.insertOne(orderData)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/orders', (req, res) => {
        // const email = req.query
        orderCollection.find(req.query)
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    const usersCollection = client.db("kitchenOffice").collection("users");

    app.post('/user', (req, res) => {
        // const email = req.query
        console.log(req.body);
        const userInfo = req.body;
        usersCollection.insertOne(userInfo)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    // app.get('/userinfo', (req, res) => {
    //     // const email = req.query
    //     usersCollection.find(req.query)
    //         .toArray((err, documents) => {
    //             res.send(documents)
    //         })
    // })
});

const port = 4000;
app.listen(process.env.PORT || port);