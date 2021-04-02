const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const auth = require('../middleware/Auth')
const multer = require('multer')
const sharp = require('sharp')

const upload = multer({
  limits:{
    fileSize:2000000
  },
  fileFilter(req,file,cb){ //request file callback
    if(!file.originalname.match(/\.(jpg|png|PNG|jpeg)$/)){
      return cb(new Error('Please upload an Image'));
    }

    cb(undefined,true) // error = undefined

  }
})
router.post('/user',async(req,res)=>{
  try{
    const user = new User(req.body);
    const newuser = await user.save();
    res.status(201).send(newuser);
  }catch(err){
    res.status(400).send(err);
  }
})

router.get('/user/me',auth,async(req,res)=>{
  res.send(req.user)
})

router.post('/user/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
  const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
  req.user.avatar = buffer;
  await req.user.save();
  res.status(200).send()
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})

router.post('/user/logout',auth,async(req,res)=>{
  try{
    req.user.tokens = req.user.tokens.filter((token)=>(token.token !== req.token))
    await req.user.save()
    res.send()
  }catch(e){
    res.status(500).send(e)
  }
})

router.post('/user/logout/all',auth,async(req,res)=>{
  try{
    req.user.tokens = [];
    await req.user.save();
    res.send();
  }catch(e){
    res.status(500).send(e);
  }
})

router.delete('/user/me',auth,async(req,res)=>{
  try{
    const user = await req.user.remove(); //to run remove of pre we
    //have to call it on the req.user instance
    if(!user)
      res.status(404).send();

    res.status(200).send(req.user);
  }catch(e){
    res.status(400).send();
  }
})

router.delete('/user/me/avatar',auth,async(req,res)=>{
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
})

router.get('/user/:id/avatar',async(req,res)=>{

  try{
    const user = await User.findById({_id:req.params.id});
    if(!user || !user.avatar)
      throw new Error();

    res.set('Content-Type','image/png');
    res.send(user.avatar)
  }catch(e){
    res.status(404).send();
  }
})

// router.get('/user/:id',async(req,res)=>{
//
//   try{
//     const _id = req.params.id;
//     const user = await User.findById(_id);
//     if(!user){
//       res.status(404).send();
//     }
//     res.status(200).send(user);
//   }catch(e){
//     res.status(400).send(e);
//   }
// });

  router.patch('/user/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body);
    const requiredUpdate = ['name','age',"Email","password"];
    const allUpdates = updates.every(update=>requiredUpdate.includes(update))
    if(!allUpdates){
      return res.status(400).send({error:"Invalid updates!"});
    }
    try{
      // const user = await User.findById(req.user._id);

      updates.forEach(update=>req.user[update] = req.body[update])
      await req.user.save();

      res.status(200).send(req.user);
    }catch(e){
      res.status(400).send(e);
    }
  })

  router.post('/user/login',async(req,res)=>{
    try{
      const user = await User.findByCredentials(req.body.Email,req.body.password);
      const token = await user.generateToken();
      res.status(200).send({user,token});
    }catch(e){
      res.status(404).send(e);
    }
  })

  module.exports = router
