
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config()
const port = 5000


// Middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnsg4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('tourDestination');
        const tourCollections = database.collection('tours')
        
        //GET API
        app.get('/tours', async(req, res)=>{
            const cursor = tourCollections.find({});
            const tours = await cursor.toArray();
            res.send(tours)
        })
        //GET SINGLE TOUR
        app.get('/tours/:id', async(req,res)=>{
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = {_id: ObjectId(id)};
            const tour = await tourCollections.findOne(query);
            res.json(tour)
        })

        // POST API
        app.post('/tours', async(req, res)=>{
            const tour = req.body;
          console.log('hit the server', tour)
          
            const result = await tourCollections.insertOne(tour);
            console.log(result);
            res.json(result)

        })

        // DELETE SINGLE BOOKING
        app.delete('/tours/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await tourCollections.deleteOne(query);
          res.json(result)
        })
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})