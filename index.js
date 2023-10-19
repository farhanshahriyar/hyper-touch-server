const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

// database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.quvfnqg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Establish connection to db named hypertouchDB
    const hypertouchCollection = client.db("hypertouchDB").collection("products");
    const hypertouchCollection2 = client.db("hypertouchDB").collection("contacts");
     

    // all post request
    // for inserting data into database
    app.post('/products', async (req, res) => {
        const newProduct = req.body;
        console.log(newProduct)
        const result = await hypertouchCollection.insertOne(newProduct);
        res.send(result); 
    })

    app.post('/contacts', async (req, res) => {
        const newContact = req.body;
        console.log(newContact)
        const result = await hypertouchCollection2.insertOne(newContact);
        res.send(result); 
    })



    // all get request
    // for reading data from database
    app.get('/products', async (req, res) => {
        const cursor = hypertouchCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
    })

    // all put request
    // all delete request







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// routes
app.get('/', (req, res) => {
    res.send('hypertouch server is up and running')
})

// listen on port
app.listen(port, () => {
    console.log(`hypertouch server is running on port ${port}`)
})