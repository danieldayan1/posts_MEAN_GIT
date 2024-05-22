const express = require('express');
const multer = require('multer');

const Post = require('../models/post')

const chachAuth = require('../middleware/chack-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png' : 'png' ,
    'image/jpeg': 'jpg' ,
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("invlaid mime type");
        if(isValid){
            error = null
        }
        cb(error,"backend/images")
    },
    filename:(req,file,cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null,name + '-' + Date.now() + '.' + ext) 
    }
})

router.get("",(req,res,next)=>{
    const pageSize = +req.query.pagesize;
    const currPage = +req.query.page;
    const postQuery=Post.find();
    let fetchPosts;
    if(pageSize&&currPage){
        postQuery.skip(pageSize*(currPage-1)).limit(pageSize);
    }
    postQuery.find().then((documents)=>{fetchPosts = documents;return Post.countDocuments()})
        .then((count)=>{res.status(200).json({message:'posts fetched succefuly !',posts:fetchPosts,maxPosts:count});})
        .catch(error=>res.status(500).json({message:'Fetching post failed !'}))
});

router.get('/:id',(req,res,next)=>{ 
    Post.findById(req.params.id)
    .then(post=>{
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message:'posts not found !'});
        }
    }).catch(error=>res.status(500).json({message:'Fetching post failed !'}))
})

router.post("",chachAuth,multer({storage:storage}).single("image"),(req,res,next)=>{
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save()
    .then(createdPost=>{res.status(201).json({message:'post added succefuly !',post:{...createdPost,id:createdPost._id,}})})
    .catch(error=>{res.status(500).json({message:'Creating a post failed !'})});
})

router.delete('/:id',chachAuth,(req,res,next)=>{
    Post.deleteOne({_id: req.params.id , creator:req.userData.userId})
    .then(result=>{
        if(result.deletedCount>0){
            res.status(200).json({message:'post delited !'});
        }else{
            res.status(401).json({message:'Not authorized !'});
        }
    }).catch(error=>res.status(500).json({message:'Delite post failed !'}))
})

router.put('/:id',chachAuth,multer({storage:storage}).single("image"),(req,res,next)=>{
    let imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + '/images/' + req.file.filename
    }else{
        imagePath = req.body.imagePath;
    }
    const post = new Post({
        _id: req.body.id,
        title:req.body.title,
        content:req.body.content,
        imagePath:imagePath  ,
        creator:req.userData.userId 
    })
    Post.updateOne({_id: req.params.id , creator:req.userData.userId},post)
    .then(result=>{
        if(result.modifiedCount>0){
            res.status(200).json({message:'post edited !'});
        }else{
            res.status(401).json({message:'Not authorized !'});
        }
        
    }).catch(error=>res.status(500).json({message:"Couldn't update the post !"}))
})

module.exports = router