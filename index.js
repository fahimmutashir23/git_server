// DB_PASS = '5Y3G5gWiW89YNkEv'
// DB_USER = 'git-interface'

const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());



const uri = "mongodb+srv://git-interface:5Y3G5gWiW89YNkEv@cluster0.pyhg6t2.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const repoCollection = client.db("GitDB").collection("repo");
    const userCollection = client.db("GitDB").collection("users");

    app.get('/repo', async(req, res) => {
        const email = req.query.email;
        const page = parseInt(req.query.page);
        let filter 
        if(email){
            filter = {email : email}
        }
        const result = await repoCollection
        .find(filter)
        .skip(page * 10)
        .limit(10)
        .toArray()
        res.send(result)
    })

    app.get("/totalRepo", async (req, res) => {
        const count = await repoCollection.estimatedDocumentCount();
        res.send({ count });
      });

    app.get('/users', async(req, res) => {
        const email = req.query.email;
        const query = {email : email}
        const result = await userCollection.findOne(query)
        res.send(result)
    })

    app.post("/users", async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const findMail = await userCollection.findOne(filter);
        if (findMail) {
          return res.send({ message: "email already exist" });
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
      });

    



    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("travel is running");
  });
  
  app.listen(port, () => {
    console.log(`GitHub is running on port ${port}`);
  });