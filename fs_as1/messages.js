// ---------- MESSAGING HELPERS ----------

// All messages between me and one other user, oldest first
function getConversation(otherId) {
  const me = currentUserId();
  return load("messages", [])
    .filter(m => (m.from === me && m.to === otherId) ||
                 (m.from === otherId && m.to === me))
    .sort((a, b) => a.time - b.time);
}

// Save a new message
function sendMessage(toId, text) {
  const messages = load("messages", []);
  messages.push({
    id: Date.now(),
    from: currentUserId(),
    to: toId,
    text: text,
    time: Date.now(),
    read: false
  });
  save("messages", messages);
}

// Mark every message FROM this person TO me as read
function markAsRead(otherId) {
  const me = currentUserId();
  const messages = load("messages", []);
  messages.forEach(function (m) {
    if (m.from === otherId && m.to === me) {
      m.read = true;
    }
  });
  save("messages", messages);
}

// How many unread messages this person has sent me
function unreadCount(otherId) {
  const me = currentUserId();
  return load("messages", []).filter(m =>
    m.from === otherId && m.to === me && !m.read).length;
}