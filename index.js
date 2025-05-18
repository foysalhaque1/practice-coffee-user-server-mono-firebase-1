const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 2000;
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
// coffee Practice
// DG0FRqQmsMMjtHLt



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q5p2qpd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const coffeesCollections = client.db('coffee_list_practice').collection('coffees');
        const usersCollections = client.db('coffee_list_practice').collection('users')
        app.get('/coffees', async (req, res) => {
            // const cursor = coffeesCollections.find();
            // const result = await cursor.toArray()
            const result = await coffeesCollections.find().toArray();
            res.send(result)
        });
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeesCollections.findOne(query);
            res.send(result);
        })
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee)
            const result = await coffeesCollections.insertOne(newCoffee);
            res.send(result)
        });
        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDocument = req.body;
            const updatedDoc = {
                $set: updatedDocument
            };
            const options = { upsert: true };
            const result = await coffeesCollections.updateOne(filter, updatedDoc, options);
            res.send(result)
        })
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            //const objectId = ObjectId.createFromHexString(id)
            const query = { _id: new ObjectId(id) };
            const result = await coffeesCollections.deleteOne(query);
            res.send(result);

        });
        //user api
        app.get('/users',async(req,res)=>{
            const result = await usersCollections.find().toArray();
            res.send(result);
        });
        app.patch('/users',async(req,res)=>{
            const {email,lastSignInTime} = req.body;
            // console.log(user)
            const filter = {email:email};
            const updatedDoc = {
                $set:{
                    lastSignInTime:lastSignInTime
                }
            }
            const result = await usersCollections.updateOne(filter,updatedDoc);
            res.send(result)
        })

        app.delete('/users/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:new ObjectId(id)};
            const result = await usersCollections.deleteOne(query);
            res.send(result)
        })
        app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await usersCollections.insertOne(user);
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

app.get('/', (req, res) => {
    res.send('server is running');
});
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})