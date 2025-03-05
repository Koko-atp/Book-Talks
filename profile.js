document.addEventListener("DOMContentLoaded", () => {
  let urlParams = new URLSearchParams(window.location.search);
  let username = urlParams.get("user");

  if (!username) {
    document.body.innerHTML =
      "<h1>ไม่พบผู้ใช้</h1><a href='index.html'>🔙 กลับไปหน้าหลัก</a>";
    return;
  }

  document.getElementById("profileUser").textContent = username;
  displayUserPosts(username);
});

function displayUserPosts(username) {
  let userPosts = document.getElementById("userPosts");
  userPosts.innerHTML = "";

  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let filteredPosts = posts.filter((post) => post.user === username);

  if (filteredPosts.length === 0) {
    userPosts.innerHTML = "<p>ไม่มีโพสต์</p>";
    return;
  }

  filteredPosts.forEach((post) => {
    let li = document.createElement("li");
    li.className = "post";
    li.innerHTML = `<p>${post.text}</p>`;
    userPosts.appendChild(li);
  });
}
