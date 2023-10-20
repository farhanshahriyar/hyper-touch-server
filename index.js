const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const { ObjectId } = require('bson');
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
    const hypertouchCollection = client.db("hypertouchDB").collection("products"); // for products
    const hypertouchCollection2 = client.db("hypertouchDB").collection("contacts"); // for contacts
    const hypertouchCollection3 = client.db("hypertouchDB").collection("refund"); // for refund
     

    // all post request
    // for inserting data into database for products
    app.post('/products', async (req, res) => {
        const newProduct = req.body;
        console.log(newProduct)
        const result = await hypertouchCollection.insertOne(newProduct);
        res.send(result); 
    })

    // for inserting data into database for contacts
    app.post('/contacts', async (req, res) => {
        const newContact = req.body;
        console.log(newContact)
        const result = await hypertouchCollection2.insertOne(newContact);
        res.send(result); 
    })

    // for inserting data into database for refund
    app.post('/refund', async (req, res) => {
        const newRefund = req.body;
        console.log(newRefund)
        const result = await hypertouchCollection3.insertOne(newRefund);
        res.send(result);
    })



    // all get request
    // for reading data from database
    app.get('/products', async (req, res) => {
        const cursor = hypertouchCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
    })

    // for reading single data from database
    app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: 'Invalid ID format.' });
      }
        const query = {_id: new ObjectId(id)};
        const result = await hypertouchCollection.findOne(query);
        res.send(result);
    })

    // all put request
    // for updating data from database
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedProduct.name,
          highlights: updatedProduct.highlights,
          supplier: updatedProduct.supplier,
          price: updatedProduct.price,
          size: updatedProduct.size,
          color: updatedProduct.color,
          category: updatedProduct.category,
          details: updatedProduct.details,
          img1: updatedProduct.img1,
          img2: updatedProduct.img2,
          img3: updatedProduct.img3,
          img4: updatedProduct.img4
        },
      }
      const result = await hypertouchCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })
    
    // all delete request
    // for deleting data from database
    app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await hypertouchCollection.deleteOne(query);
        res.send(result);
    })







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