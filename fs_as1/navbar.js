// Draws the top navigation bar into <div id="navbar"></div>
function renderNavbar() {
  const me = currentUser();

  document.getElementById("navbar").innerHTML = `
    <div class="nav-inner">
      <h2 class="logo">ConnecFriend</h2>
      <div class="nav-links">
        <a href="home.html">Home</a>
        <a href="people.html">People</a>
        <a href="profile.html">Profile</a>
        <a href="messages.html">Messages</a>
        <span class="nav-user">${me.name}</span>
        <button onclick="logout()">Logout</button>
      </div>
    </div>
  `;
}