
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const port =process.env.PORT||5000;
require('dotenv').config()



// Middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnsg4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('tourDestination');
        const tourCollections = database.collection('tours');
        const myBookingCollections = database.collection('myBooking');
        
        //GET API
        app.get('/tours', async(req, res)=>{
            const cursor = tourCollections.find({});
            const tours = await cursor.toArray();
            res.send(tours)
        })
        
        //GET SINGLE TOUR
        app.get('/tours/:id', async(req,res)=>{
            const id = req.params.id;
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


       

        //POST MY BOOKING API
        app.post('/myBooking', async(req, res)=>{
          const result = await myBookingCollections.insertOne(req.body);
          res.json(result)
      })
      // GET MY BOOKING API
    app.get('/myBooking/:email',async(req,res)=>{
      const email = req.params.email;
      const find = {email:email}
      const result = await myBookingCollections.find(find).toArray();
      res.json(result)
    })
    // DELETE MY BOOKING API
    app.delete('/myBooking/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await myBookingCollections.deleteOne(query)
      res.json(result)
      console.log(result)
    });
    // UPDATE MY BOOKING API
    app.get('/myBookinged/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const result = await myBookingCollections.findOne(query)
      res.json(result)
      console.log(id)
    })
    // 
    app.put('/myBookinged/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const updateItem = req.body;
      const options = { upsert:true};
      const updateDoc ={
        $set:{
          Address:updateItem.Address,
          price:updateItem.price,
          email:updateItem.email,
        },
      };
      const result = await myBookingCollections.updateOne(query,updateDoc,options)
      res.json(result)
    })
    // ALL MANAGE ODER 
    app.get('/manage',async(req,res)=>{
      const result = await myBookingCollections.find({}).toArray();
      res.json(result)
    })
    // ALL MANAGE ODER DELETE
    app.delete('/manage/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await myBookingCollections.deleteOne(query)
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