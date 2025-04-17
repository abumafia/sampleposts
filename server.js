
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const POSTS_FILE = path.join(__dirname, 'data/posts.json');

// Load posts from file or initialize empty array
function loadPosts() {
  try {
    return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

// Save posts to file
function savePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// API: Get all posts
app.get('/api/posts', (req, res) => {
  res.json(loadPosts());
});

// API: Create a new post
app.post('/api/posts', (req, res) => {
  const posts = loadPosts();
  const { author, content, image } = req.body;
  const newPost = {
    id: Date.now(),
    author,
    content,
    image,
    likes: 0
  };
  posts.push(newPost);
  savePosts(posts);
  res.status(201).json(newPost);
});

// API: Like a post
app.post('/api/posts/:id/like', (req, res) => {
  const posts = loadPosts();
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.likes += 1;
    savePosts(posts);
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// API: Delete post (admin only)
app.delete('/api/posts/:id', (req, res) => {
  let posts = loadPosts();
  posts = posts.filter(p => p.id != req.params.id);
  savePosts(posts);
  res.status(204).send();
});

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.get('/admin', (req, res) => res.sendFile(__dirname + '/views/admin.html'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
