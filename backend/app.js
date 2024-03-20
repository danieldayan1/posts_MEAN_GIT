//dandayan9 , WI5GVIiNyndkXVoK , 87.71.222.19/32    // C:\Users\danda\AppData\Local\Programs\mongosh\
const path = require('path')
const express = require('express');
const bodyPurser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const postsRoutes = require('./routes/posts');

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-type,Accept");
    res.setHeader('Access-Control-Allow-Methods',"GET,POST,PATCH,DELETE,PUT,OPTIONS");
    next(); 
 });

mongoose.connect("mongodb+srv://dandayan9:WI5GVIiNyndkXVoK@cluster0.jf2lh51.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(()=>{console.log('connected to DB !')})
.catch(()=>{console.log('connection failed !')});

app.use(bodyPurser.json());  // app.use(bodyPurser.urlencoded({extended:false}));

app.use("/images" , express.static(path.join('backend/images')));

app.use('/api/posts',postsRoutes);

module.exports = app;
