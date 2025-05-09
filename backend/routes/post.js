const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

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

    let imageURL = '';
    
    if (imageUrl && imageUrl.startsWith('data:image/')) {
      try {
        const matches = imageUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (!matches || matches.length !== 3) {
          throw new Error('Invalid image data');
        }
        
        const imageType = matches[1]; 
        const base64Data = matches[2];
        const imageBuffer = Buffer.from(base64Data, 'base64');

        const filename = `image-${Date.now()}-${Math.round(Math.random() * 1E9)}.${imageType}`;

        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
    
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, imageBuffer);
        
        imageURL = `/uploads/${filename}`;
        
      } catch (imgError) {
        console.error('Error processing image:', imgError);
      }
    }

    console.log({imageURL})

    const newPost = new Post({
      title,
      text,
      date,
      event,
      destination,
      imageUrl:imageURL, 
      spotifyEmbedUrl,
      email,
      authorName,
      createdAt: new Date(),
    });

    await newPost.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('new-post', newPost);
    }

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
