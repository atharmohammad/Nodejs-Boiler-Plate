const express = require('express');
require('./db/mongoose');
const userRouter = require('./router/User');
const tasksRouter = require('./router/Tasks');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);



app.listen(port,()=>console.log("Server is up and running at port: " + port));
const Tasks = require('./models/Tasks');
const User = require('./models/User');

// const func = async()=>{
  // const task = await Tasks.findById('6065ff36188d9b1d14c3edb2');
  // await task.populate('owner').execPopulate() //we populate the owner field with its User data
  //             //by using owner id to take data this happened as we set ref in owner field in tasks model
  // console.log(task.owner)
  // const user = await User.findById('6065882c640d6903f4a683f9');
  // await user.populate('tasks').execPopulate();
  // console.log(user.tasks)
  //Here we do move in opposite direction of relation and populate the virtual field which is in the user
// }
// func();
