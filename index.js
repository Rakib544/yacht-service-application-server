const express = require('express');
const cors = require('cors')
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjo8u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Hello I am now working on my yacht service project')
})

client.connect(err => {
    const serviceCollection = client.db("yacht-service").collection("services");
    const reviewCollection = client.db("yacht-service").collection("reviews");
    const adminCollection = client.db("yacht-service").collection("admins");
    const orderCollection = client.db("yacht-service").collection("orders");

    app.post('/addService', (req, res) => {
        const service = req.body;
        serviceCollection.insertOne(service)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount > 0)
            })
            .catch(error => {
                console.log(error)
            })
    })

    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        adminCollection.insertOne(newAdmin)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/allOrderList', (req, res) => {
        orderCollection.find({})
        .toArray((err, orders) => {
            res.send(orders)
        })
    })

    app.get('/usersOrders', (req, res) => {
        const email = req.body.email;
        orderCollection.find({email: email})
        .toArray((err, orders) => {
            res.send(orders)
        })
    })

});


app.listen(process.env.PORT || 8080);