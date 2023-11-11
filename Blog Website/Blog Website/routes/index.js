const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Home route
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render('home', { posts: posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Individual post route
router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('post', { post: post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// New post route
router.get('/newpost', (req, res) => {
  res.render('newpost');
});

// Create post route
router.post('/newpost', async (req, res) => {
  const newPost = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  try {
    const post = await Post.create(newPost);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
