const express = require('express');
const bodyPurser = require('body-parser');
const app = express();

app.use(bodyPurser.json());
// app.use(bodyPurser.urlencoded({extended:false}));

app.use((req,res,next)=>{
   res.setHeader('Access-Control-Allow-Origin',"*");
   res.setHeader('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-type,Accept");
   res.setHeader('Access-Control-Allow-Methods',"GET,POST,PATCH,DELETE,PUT,OPTIONS");
   next();
});

app.get('/api/posts',(req,res,next)=>{
    const posts=[
        {id:'efhkjh',title:'title 1',content:'content 1'},
        {id:'edfsfh',title:'title 2',content:'content 2'}
    ]
    res.status(200).json({message:'posts fetched succefuly !',posts:posts})  ;
});

app.post('/api/posts',(req,res,next)=>{
    const post = req.body;
    console.log(post);
    res.status(201).json({message:'post added succefuly !'})
})


module.exports = app;