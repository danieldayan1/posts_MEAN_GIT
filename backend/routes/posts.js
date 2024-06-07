const express = require('express');

const PostsController = require('../controllers/posts');

const chachAuth = require('../middleware/chack-auth');
const extractFile = require('../middleware/file')

const router = express.Router();


router.get("",PostsController.GetPost);

router.get('/:id',PostsController.GetPostByID);

router.post("",chachAuth,extractFile,PostsController.createPost);

router.delete('/:id',chachAuth,PostsController.DeletePost);

router.put('/:id',chachAuth,extractFile,PostsController.UpdatePost);


module.exports = router