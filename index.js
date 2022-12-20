const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster1.rvqsrsr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userDataCollection = client.db("usersData").collection("usersData");
    //save data in the database
    app.post("/userData", async (req, res) => {
      const data = req.body;
      const result = await userDataCollection.insertOne(data);
      res.send(result);
    });
    //get all data specific user
    app.get("/userData", async (req, res) => {
      const name = req.query.useName;
      const query = { userName: name };
      const result = await userDataCollection.find(query).toArray();
      res.send(result);
    });
    //delete data using id
    app.delete("/userData", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      const result = await userDataCollection.deleteOne(query);
      res.send(result);
    });
    //update data
    app.put("/userData", async (req, res) => {
      const id = req.query.id;
      const data = req.body.editedText;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
            sectors: data,
        },
      };
      const result = await userDataCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("server is liv now");
});

app.get("*", (req, res) => {
  res.status(401).send("unauthorized access!");
});

app.listen(port, () => {
  console.log(`the server is running in port:${port}`);
});
