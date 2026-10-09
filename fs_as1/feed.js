// ---------- HELPERS ----------

// Turns a timestamp into text like "5 min ago"
function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + " min ago";

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + (hours === 1 ? " hour ago" : " hours ago");

  const days = Math.floor(hours / 24);
  return days + (days === 1 ? " day ago" : " days ago");
}

// Makes user-typed text safe to show inside HTML
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------- FEED ----------

// Posts the current user is allowed to see, newest first
function getFeed() {
  const me = currentUserId();
  return load("posts", [])
    .filter(post => post.authorId === me || post.visibleTo.includes(me))
    .sort((a, b) => b.time - a.time);
}

// Current user's friends, most recent login first
function getFriendsByLogin() {
  const me = currentUser();
  return me.friends
    .map(id => getUserById(id))
    .sort((a, b) => b.lastLogin - a.lastLogin);
}

// ---------- LIKE / DISLIKE ----------

function likePost(postId) {
  const posts = load("posts", []);
  const post = posts.find(p => p.id === postId);
  const me = currentUserId();

  post.dislikes = post.dislikes.filter(id => id !== me);

  if (post.likes.includes(me)) {
    post.likes = post.likes.filter(id => id !== me);
  } else {
    post.likes.push(me);
  }
  save("posts", posts);
}

function dislikePost(postId) {
  const posts = load("posts", []);
  const post = posts.find(p => p.id === postId);
  const me = currentUserId();

  post.likes = post.likes.filter(id => id !== me);

  if (post.dislikes.includes(me)) {
    post.dislikes = post.dislikes.filter(id => id !== me);
  } else {
    post.dislikes.push(me);
  }
  save("posts", posts);
}

// ---------- SHARING NEWS ----------

function createPost(text, visibleTo, image) {
  const posts = load("posts", []);
  posts.push({
    id: Date.now(),
    authorId: currentUserId(),
    text: text,
    image: image || null,
    time: Date.now(),
    visibleTo: visibleTo,
    likes: [],
    dislikes: []
  });
  save("posts", posts);
}