// ---------- FRIEND REQUESTS ----------

function hasPendingRequest(fromId, toId) {
  return load("requests", []).some(r =>
    r.from === fromId && r.to === toId && r.status === "pending");
}

// Returns { ok: true/false, message: "..." }
function sendFriendRequest(toId) {
  const me = currentUser();
  const target = getUserById(toId);

  if (toId === me.id) {
    return { ok: false, message: "You can't add yourself." };
  }
  if (me.friends.includes(toId)) {
    return { ok: false, message: "You are already friends." };
  }
  // Ignore-list rule: check the RECEIVER's list for the sender
  if (target.ignoreList.includes(me.id)) {
    return { ok: false, message: "You can't send a friend request to this user." };
  }
  if (hasPendingRequest(me.id, toId)) {
    return { ok: false, message: "Request already sent." };
  }
  if (hasPendingRequest(toId, me.id)) {
    return { ok: false, message: "This user already sent you a request. Check Friend Requests." };
  }

  const requests = load("requests", []);
  requests.push({ from: me.id, to: toId, status: "pending" });
  save("requests", requests);
  return { ok: true, message: "Friend request sent to " + target.name + "." };
}

function getIncomingRequests() {
  const me = currentUserId();
  return load("requests", []).filter(r => r.to === me && r.status === "pending");
}

function acceptRequest(fromId) {
  const me = currentUserId();
  const users = load("users", []);
  const requests = load("requests", []);

  const meUser = users.find(u => u.id === me);
  const otherUser = users.find(u => u.id === fromId);

  if (!meUser.friends.includes(fromId)) meUser.friends.push(fromId);
  if (!otherUser.friends.includes(me)) otherUser.friends.push(me);

  const request = requests.find(r =>
    r.from === fromId && r.to === me && r.status === "pending");
  request.status = "accepted";

  save("users", users);
  save("requests", requests);
}

function declineRequest(fromId) {
  const me = currentUserId();
  const requests = load("requests", []);
  const request = requests.find(r =>
    r.from === fromId && r.to === me && r.status === "pending");
  request.status = "declined";
  save("requests", requests);
}

// ---------- RATING ----------

function rateFriend(friendId, rating) {
  const users = load("users", []);
  const me = users.find(u => u.id === currentUserId());
  me.ratings[friendId] = rating;
  save("users", users);
}