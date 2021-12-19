const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectID = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wq1g6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('workout-zone');
        const servicesCollection = database.collection('services');
        const bookingsCollection = database.collection("bookings");
        const reviewsCollection = database.collection("reviews");
        const usersCollection = database.collection("users");
        // console.log('database connected successfully')

         // POST API for Add services
      app.post('/addServices', async(req, res) => {
        const result = await servicesCollection.insertOne(req.body);
        res.json(result)
    })
         // GET API for allServices
      app.get('/allServices', async(req, res) => {
        const result = await servicesCollection.find({}).toArray();
        res.json(result)
    })

      // GET API for Display Single Bike
      app.get('/singleServices/:id', async(req, res) => {
        const id = req.params.id  
        const query ={_id:ObjectID(id)}
        const singleServices= await servicesCollection.findOne(query);
        res.json(singleServices);
      })


      

      // POST API for order's data store to database
      app.post('/addMyBookings', async(req,res) => {
        const result = await bookingsCollection.insertOne(req.body);
        console.log(result);
        res.json(result)
      })
      // GET API for MyOrder
      app.get('/myOrder/:email', async(req,res) => {
        const email = req.params.email;
        console.log(email);
        const query = {email:email}
        const result = await bookingsCollection.find(query).toArray();
        res.json(result)
      })
      // DELETE API for deleting orders
      app.delete('/deletedOrder/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectID(id)}
        const deletedOrder = await bookingsCollection.deleteOne(query);
        console.log(deletedOrder);
        res.json(deletedOrder);
      })


      // POST API for set review
      app.post('/addReview', async(req,res) => {
        const result = await reviewsCollection.insertOne(req.body);
        console.log(result);
        res.json(result)
      })
      // GET API for display review
      app.get('/displayReviews', async(req,res) => {
        const result = await reviewsCollection.find({}).toArray();;
        console.log(result);
        res.json(result)
      })


      // Register User Info
      app.post('/addUserInfo', async(req, res)=>{
        const query = req.body;
        const result = await usersCollection.insertOne(query);
        console.log(result);
      })


      // Make Admin 
      app.put('/makeAdmin', async(req, res)=> {
        const filter = {email: req.body.email}
        const result = await usersCollection.find(filter).toArray();
        
        if(result){
          const updateAdmin = await usersCollection.updateOne(filter,{
            $set: { role: "admin" },
          })
        }
      })
      // check admin
      app.get('/checkAdmin/:email', async(req, res) => {
        const result = await usersCollection.find({email: req.params.email}).toArray()
        res.json(result)
      })


      // MAnage Products
      app.delete('/deleteProduct/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectID(id)}
        const deleteProduct = await servicesCollection.deleteOne(query);
        console.log(deleteProduct);
        res.json(deleteProduct);
      })

      // All Orders Manage Products
      app.get('/manageOrder', async(req, res)=>{
        const result = await bookingsCollection.find({}).toArray();
        res.json(result)
      })


      // Status Update from Order list
      app.put('/statusUpdate/:id', async(req, res) => {
        const id = {_id: ObjectID(req.params.id)};
        const result = await bookingsCollection.updateOne(id,{
          $set: {
            status: req.body.status
          }
        })
        res.json(result);

      })

      // Delete all Order 
      app.delete('/deleteOrders/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectID(id)}
        const deleteOrders = await bookingsCollection.deleteOne(query);
        console.log(deleteOrders);
        res.json(deleteOrders);
      })


    }
    finally{

    }

}

run().catch(console.dir);

// console.log(uri);


app.get('/', (req, res) => {
  res.send('Hello Workout Zone!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})