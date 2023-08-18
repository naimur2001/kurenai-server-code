require("dotenv").config()
const express=require("express");
const cors=require("cors")
const app=express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port=process.env.PORT || 5000;


// middleware 
app.use(express.json())
app.use(cors())
// basic get method
app.get('/',(req,res)=>{
  res.send('Kurenai Server is Running')
})
app.listen(port,()=>{
  console.log(`Server Port is : ${port}`)
})

//db setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.davgd3f.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    //user db
    const usersCollection=client.db("kurenai-db").collection("users")
    //blog db
    const blogsCollection=client.db("kurenai-db").collection("blogs")

//post method for register
app.post('/post_user', async (req, res) => {
  const user = req.body;

  // Transform email to lowercase before querying
  user.email = user.email.toLowerCase();

  const query = {
    $and: [
      { username: user.username },
      { email: user.email }
    ]
  };

  try {
    const existingUser = await usersCollection.findOne(query);

    if (existingUser) {
      return res.send({ message: 'User already exists' });
    }

    const result = await usersCollection.insertOne(user);
    res.send(result);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate username error
      return res.send({ message: 'Username is already taken' });
    }
    // Handle other errors as needed
    console.error(error);
    res.status(500).send({ message: 'An error occurred' });
  }
});

//get method for login
app.get('/get_user/:username/:password', async (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  const filter = { username: username, password: password }; 

 
  const result = await usersCollection.findOne(filter);

  if (result) {
    res.send({ message: 'User found', user: result });
  } else {
    res.send({ message: 'User not found' });
  }
});
// get method for blog
app.get('/get_user', async(req,res)=>{
  const result=await usersCollection.find().toArray();
  res.send(result)
})

//post method for blog

app.post('/post_blog', async (req, res) => {
  const blog = req.body;
  const result = await blogsCollection.insertOne(blog);
  res.send(result);
 
});

// get method for blog
app.get('/get_blog', async(req,res)=>{
  const result=await blogsCollection.find().toArray();
  res.send(result)
})




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
