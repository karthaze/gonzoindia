const Post = require('../models/post');

exports.createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

// get all posts, optionally filtered eg. /api/posts?authorName=John&destination=Goa
exports.getPosts = async (req, res) => {
  try {
    const filters = {};
    if (req.query.authorName) filters.authorName = req.query.authorName;
    if (req.query.destination) filters.destination = req.query.destination;
    if (req.query.event) filters.event = req.query.event;

    const posts = await Post.find(filters).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};
