// ---------- AUTHENTICATION HELPERS ----------

// Returns the user if username and password match, otherwise null
function login(username, password) {
  const users = load("users", []);
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return null;

  user.lastLogin = Date.now();
  save("users", users);

  sessionStorage.setItem("currentUserId", user.id);
  return user;
}

function currentUserId() {
  const id = sessionStorage.getItem("currentUserId");
  return id ? Number(id) : null;
}

function currentUser() {
  return getUserById(currentUserId());
}

function logout() {
  sessionStorage.removeItem("currentUserId");
  window.location.href = "login.html";
}

// Call at the top of every protected page
function requireLogin() {
  if (!currentUserId()) {
    window.location.href = "login.html";
  }
}