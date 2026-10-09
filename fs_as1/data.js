// ---------- SAMPLE DATA ----------
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

// Bump this number whenever the sample data changes, to reload it once
const DATA_VERSION = "2";

// Makes an avatar picture URL from a name
function avatar(name, color) {
  return "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) +
         "&background=" + color + "&color=fff&size=200&bold=true";
}

const defaultUsers = [
  { id: 1, username: "ali", password: "1234", name: "Ali Khan",
    photo: avatar("Ali Khan", "1877f2"), bio: "CS student who loves AI.", email: "ali@example.com",
    lastLogin: Date.now() - 5 * MIN,
    friends: [2, 3], ignoreList: [], ratings: { 2: 3, 3: 2 } },

  { id: 2, username: "sara", password: "1234", name: "Sara Ahmed",
    photo: avatar("Sara Ahmed", "e91e63"), bio: "Designer and coffee addict.", email: "sara@example.com",
    lastLogin: Date.now() - 2 * HOUR,
    friends: [1, 3], ignoreList: [5], ratings: {} },

  { id: 3, username: "hamza", password: "1234", name: "Hamza Raza",
    photo: avatar("Hamza Raza", "2e7d32"), bio: "Cricket and code.", email: "hamza@example.com",
    lastLogin: Date.now() - 30 * MIN,
    friends: [1, 2, 4], ignoreList: [], ratings: {} },

  { id: 4, username: "ayesha", password: "1234", name: "Ayesha Noor",
    photo: avatar("Ayesha Noor", "f57c00"), bio: "Book lover.", email: "ayesha@example.com",
    lastLogin: Date.now() - 1 * DAY,
    friends: [3], ignoreList: [], ratings: {} },

  { id: 5, username: "bilal", password: "1234", name: "Bilal Sheikh",
    photo: avatar("Bilal Sheikh", "6a1b9a"), bio: "New here!", email: "bilal@example.com",
    lastLogin: Date.now() - 3 * DAY,
    friends: [], ignoreList: [], ratings: {} }
];

const defaultPosts = [
  { id: 1, authorId: 2, text: "Just finished my new design project!",
    image: "https://picsum.photos/seed/design/600/300",
    time: Date.now() - 3 * HOUR, visibleTo: [1, 3], likes: [1], dislikes: [] },

  { id: 2, authorId: 3, text: "What a match last night! Unbelievable.",
    image: "https://picsum.photos/seed/cricket/600/300",
    time: Date.now() - 1 * HOUR, visibleTo: [1, 2, 4], likes: [2, 4], dislikes: [1] },

  { id: 3, authorId: 4, text: "Reading a great book on machine learning.",
    image: null,
    time: Date.now() - 5 * HOUR, visibleTo: [3], likes: [], dislikes: [] },

  { id: 4, authorId: 1, text: "Starting my web development assignment today.",
    image: null,
    time: Date.now() - 20 * MIN, visibleTo: [2, 3], likes: [], dislikes: [] }
];

const defaultMessages = [
  { id: 1, from: 2, to: 1, text: "Hey Ali, how is the assignment going?",
    time: Date.now() - 40 * MIN, read: false }
];

const defaultRequests = [];

// ---------- STORAGE HELPERS ----------
function load(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Put the sample data into localStorage (only first time, or when DATA_VERSION changes)
function initData() {
  if (localStorage.getItem("dataVersion") !== DATA_VERSION) {
    save("users", defaultUsers);
    save("posts", defaultPosts);
    save("messages", defaultMessages);
    save("requests", defaultRequests);
    localStorage.setItem("dataVersion", DATA_VERSION);
  }
}

function getUserById(id) {
  return load("users", []).find(u => u.id === id);
}

initData();