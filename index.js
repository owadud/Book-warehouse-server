const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

//middle 

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwqot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const bookCollection = client.db('warehouse').collection('book-collection');
        app.get('/books', async(req, res) => {
            const query = {};
            const cursor = bookCollection.find(query);
            const books = await cursor.limit(2).toArray();
           
            res.send(books);
        });

        app.get('/books/update/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const update = await bookCollection.findOne(query);
            res.send(update);
        })

        //Post

        app.post('/books', async (req, res) => {

            const newSupplier = req.body;
            const result = await bookCollection.insertOne(newSupplier);
            res.send(result);
        })

        //delete
        app.delete('/books/update/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {

    }
}

run().catch(console.log.dir)



//get

app.get('/', (req, res) => {
    res.send('running');
})

app.listen(port, () => {
    console.log('listening', port);
})