const express = require('express');
const router = new express.Router();
const Tasks = require('../models/Tasks');
const auth = require('../middleware/Auth');
//GET localhost:3000/tasks?compeleted=true
//GET localhost:3000/tasks?limit=2&skip=2
router.get('/tasks',auth,async(req,res)=>{
  const match = {};
  const sort = {};
  if(req.query.compeleted){
    match.compeleted = req.query.compeleted === 'true'
  }
  //GET ?sortBy=createdAt:desc to sort in descending order of createdAt
  if(req.query.sortBy){
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = (parts[1] == 'desc' ? -1 : 1);
  }

  try{
    await req.user.populate({
      path:'tasks',
      match:match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort:sort
      }
    }).execPopulate();
    res.status(200).send(req.user.tasks);
  }catch(err){
    res.status(400).send(err);
  }
})

router.post('/tasks',auth,async(req,res)=>{
  try{
    const task = new Tasks({
      ...req.body,
      owner:req.user._id
    });
    const proc = await task.save();
    res.status(201).send(proc);
  }catch(e){
    res.status(400).send(e);
  }
})



router.get('/tasks/:id',auth,async(req,res)=>{
  const _id = req.params.id;
  try{
    const task = await Tasks.findOne({_id,owner:req.user._id});
    if(!task)
      res.status(404).send();

    res.status(200).send(task);
  }catch(e){
    res.status(400).send(e);
  }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
  const updates = Object.keys(req.body);
  const requiredUpdates = ['description','compeleted'];
  const isValidReq = updates.every(update=>{
    return requiredUpdates.includes(update);
  });
  if(!isValidReq){
    return res.status(400).send();
  }
  try{
    const task = await Tasks.findOne({_id:req.params.id,owner:req.user._id});
    if(!task)
        res.status(404).send();

    updates.forEach((item) => {
      task[item] = req.body[item]
    });
    await task.save();
    res.status(200).send(task);
  }catch(e){
    res.status(400).send(e);
  }

})

router.delete('/tasks/:id',auth,async(req,res)=>{
  const _id = req.params.id
  try{
    const task = await Tasks.findOneAndDelete({_id,owner:req.user._id});
    if(!task)
      res.status(404).send();

    res.status(200).send(task);
  }catch(e){
    res.status(400).send(e);
  }
})

module.exports = router
