const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

router.post('/', async (req, res) => {
  try {
    const {
      title,
      text,
      date,
      event,
      destination,
      spotifyEmbedUrl,
      email,
      authorName,
      imageUrl
    } = req.body;

    let uploadedImageUrl = '';

    if (imageUrl && imageUrl.startsWith('data:image/')) {
      try {
        const matches = imageUrl.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) throw new Error('Invalid image data');

        const base64Data = `data:image/${matches[1]};base64,${matches[2]}`;

        const uploadRes = await cloudinary.uploader.upload(base64Data, {
          folder: 'gonzo_posts',
        });

        uploadedImageUrl = uploadRes.secure_url;
      } catch (imgErr) {
        console.error('Cloudinary upload error:', imgErr);
      }
    }

    const newPost = new Post({
      title,
      text,
      date,
      event,
      destination,
      imageUrl: uploadedImageUrl,
      spotifyEmbedUrl,
      email,
      authorName,
      createdAt: new Date(),
    });

    await newPost.save();

    const io = req.app.get('io');
    if (io) io.emit('new-post', newPost);

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});



router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
