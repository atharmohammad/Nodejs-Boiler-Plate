const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://athar:athar123@task-manager-cluster.w1cta.mongodb.net/task-manager?retryWrites=true&w=majority'
const client = new MongoClient(url);
const ObjectID = require('mongodb').ObjectID;

const create = async(req,res,next)=>{
  const prod = {
    name:'Adnan',
    age:22,
    class:4
  };
  try{
    await client.connect(); //First connect to client
    const db = client.db(); //take the database instance
    const result = db.collection('users').insertOne(prod);//populate the data base
    console.log("Connected to database");
  }catch(error){ //if errror message given
      return console.log("Error connecting to database")
  };
    client.close(); //close the client connection
    res.json(prod)
}

// create();

const createMany = async(req,res,next)=>{
  const arr = [
    {
      description:"Space is dark",
      compeleted:true
    },
    {
      description:"Water is Models",
      compeleted:false
    }
  ];
  try{
    await client.connect();
    const db = client.db();
    const result = db.collection('Science').insertMany(arr,(error,result)=>{
      if(error)
        console.log(error);
      else {
        console.log(result);
      }
    });
  }catch(error){
    console.log("Cannot connect to database");
  }
  client.close();
  res.json(arr)
}

// createMany();

const show = async(req,res,next)=>{
  try{
    await client.connect();
    const db = client.db();
    const result = db.collection('Science').findOne({description:"Space is dark"},(error,res)=>{
      if(res)
        console.log(res);
      else
      console.log(error)
    })
  }catch(err){
    console.log(err);
  }
  client.close();
}

// show();

const showUsers = async(req,res,next)=>{
  try{
    await client.connect();
    const db = client.db();
    const result = db.collection('users').find({name:'Adnan'}).toArray((err,res)=>{
      if(res)
        console.log(res);
      else
        console.log(res);
    })
  }catch(err){
    console.log(err);
  }
  client.close();
}

// showUsers()

const updateUser = async(req,res,next)=>{
  try{
    await client.connect();
    const db = client.db();
    db.collection('users').updateOne({
      // _id:new ObjectID('605ebe3f7554513904013e9d')
      name:'Adnan'
    },{
      $set:{
        name:'Mohd Anas',
        age:20
      }
    }).then(resolve=>console.log(resolve))
      .catch(err=>console.log(err))
  }catch(err){
    console.log(err);
  }

  client.close();
}

// updateUser()

const updateMultipleUser = async(req,res,next)=>{
  try{
    await client.connect();
    const db = client.db();
    db.collection('users').updateMany({
      name:'Adnan'
    },{
      $set:{
        name:"Anas Mohammmad",
        age:23
      }
    }).then(resolve=>console.log(resolve))
      .catch(err=>console.log(err))
  }catch(er){
    console.log(er)
  }
  client.close();
}

// updateMultipleUser();

const deleteUser = async(req,res,next)=>{
  try{
    await client.connect();
    const db = client.db();
    db.collection('users').deleteOne({name:'Athar'})
      .then(resolve=>console.log(resolve))
      .catch(err=>sonsole.log(err))
  }catch(error){
    console.log(error)
  }

  client.close();
}

deleteUser();


// MongoClient.connect(connectionUrl,{useNewUrlParser:true,useUnifiedTopology: true },(error,client)=>{
//   if(error){
//     return console.log('Unable to connect to database')
//   }
//
//   console.log("Connected to database")
//   const db = client.db(databaseName) //db is database
//
//   db.collection('users').insertOne({
//     name:'Athar',
//     age:50
//   })
//
// })
