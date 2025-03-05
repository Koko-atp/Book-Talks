document.addEventListener("DOMContentLoaded", () => {
  let currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    showPostSection(currentUser);
  }
  displayPosts(); // โหลดโพสต์เมื่อเปิดหน้า

});

// เข้าสู่ระบบ
function login() {
  let username = document.getElementById("usernameInput").value.trim();
  if (username === "") return alert("กรุณากรอกชื่อผู้ใช้");

  localStorage.setItem("currentUser", username);
  showPostSection(username);
}

function showPostSection(username) {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("postSection").style.display = "block";
  document.getElementById("currentUser").textContent = username;
  document.getElementById(
    "currentUserLink"
  ).href = `profile.html?user=${username}`;
  displayPosts();
}

// ออกจากระบบ
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "home.html";
}

// เปิด/ปิดป๊อปอัปโพสต์
// function openPopup() {
//   let popup = document.getElementById("postPopup");
//   popup.style.display = "flex";
//   setTimeout(() => {
//     popup.style.opacity = "1";
//   }, 50);
// }

// function closePopup() {
//   let popup = document.getElementById("postPopup");
//   popup.style.opacity = "0";
//   setTimeout(() => {
//     popup.style.display = "none";
//   }, 300);
// }

// ฟังก์ชันส่งโพสต์จากป๊อปอัป

// บันทึกโพสต์ลง localStorage
function savePost(postText, imageURL) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let newPost = {
    id: Date.now(),
    user: localStorage.getItem("currentUser"),
    text: postText,
    image: imageURL,
    replies: [],
  };

  posts.unshift(newPost); // ใส่โพสต์ใหม่ไปที่ต้นของ Array
  localStorage.setItem("posts", JSON.stringify(posts));

  // แสดงโพสต์ใหม่ทันที
  displayPosts();
}

// แสดงโพสต์ทั้งหมด
function displayPosts() {

  let currentUser = localStorage.getItem('currentUser')
  let postList = document.getElementById("postList");
  postList.innerHTML = "";

  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.forEach((post) => {
    let li = document.createElement("li");
    li.className = "post";
    li.innerHTML = `
      <p><strong><a href="profile.html?user=${post.user}">${post.user}</a></strong>: ${post.text}</p>
      ${post.image? `<img src="${post.image}" style="max-width: 100%; margin-top: 10px;">`: ""}

      `

      if (post.user === currentUser){
          let Delbtn = document.createElement('div')
          Delbtn.innerHTML = `
          <button onclick="toggleReplyBox(${post.id})"><i class="fa-solid fa-comment"></i></button>
          <button onclick="deletePost(${post.id})" style="color: white;" id='Delbtn'><i class="fa-solid fa-trash"></i></button>`
          li.appendChild(Delbtn)
    }
    else{
      let Delbtn = document.createElement('div')
      Delbtn.innerHTML = `
      <button onclick="toggleReplyBox(${post.id})"><i class="fa-solid fa-comment"></i></button>`
      li.appendChild(Delbtn)
    }

    let lowerpart = document.createElement('div')
    lowerpart.innerHTML = `<!-- 🔹 กล่องพิมพ์ตอบกลับ -->
      <div id="replyBox-${post.id}" class="reply-box" style="display: none;">
      <input type="text" id="replyInput-${post.id}" placeholder="พิมพ์ตอบกลับ...">
      <button onclick="addReply(${post.id})">ส่ง</button>
      </div>
      
      <!-- 🔹 รายการตอบกลับ -->
      <ul class="reply-section" id="replies-${post.id}">
      ${post.replies.map(reply => `<li><strong>${reply.user}</strong>: ${reply.text}</li>`).join("")}
      </ul>`
      
    li.appendChild(lowerpart)
    


    postList.appendChild(li);

    // แสดงข้อความตอบกลับ
    post.replies.forEach((reply) => {
      let replyLi = document.createElement("li");
      replyLi.innerHTML = `<strong>${reply.user}</strong>: ${reply.text}`;
      
    });
  });


}

// แสดง/ซ่อนกล่องตอบกลับ
function toggleReplyBox(postId) {
  let replyBox = document.getElementById(`replyBox-${postId}`);
  replyBox.style.display = replyBox.style.display === "none" ? "block" : "none";
}

// ลบโพสต์
function deletePost(postId) {
  let currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return alert("กรุณาเข้าสู่ระบบ");

  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) return;

  let confirmDelete = confirm(
    `คุณต้องการลบโพสต์ของ "${posts[postIndex].user}" หรือไม่?`
  );
  if (currentUser !== posts[postIndex].user ){
    return alert("นีไม่ใช่โพสต์ของคุณ คุณกดได้ยังไง!");
  }
  if (confirmDelete) {
    posts.splice(postIndex, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts();
  }
}

// โหลดภาพตัวอย่าง
document
  .getElementById("imageInput")
  .addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = function (e) {
        let previewImage = document.getElementById("previewImage");
        if (previewImage) {
          previewImage.src = e.target.result;
          previewImage.style.display = "block";
        }
      };
      reader.readAsDataURL(file);
    }
  });
// ฟังก์ชันเพิ่มการตอบกลับ
function addReply(postId) {
  let replyInput = document.getElementById(`replyInput-${postId}`).value.trim();
  let currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return alert("กรุณาเข้าสู่ระบบ");
  if (replyInput === "") return;

  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let post = posts.find((p) => p.id === postId);
  if (post) {
    post.replies.push({ user: currentUser, text: replyInput });
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts();
  }
}
document
  .getElementById("imageInput")
  .addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = function (e) {
        let previewImage = document.getElementById("previewImagePopup");
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        document.getElementById("imagePreviewContainer").style.display =
          "block";
      };
      reader.readAsDataURL(file);
    }
  });
function submitPost() {
  let postInput = document.getElementById("popupPostInput").value.trim();
  let currentUser = localStorage.getItem("currentUser");
  let imageInput = document.getElementById("imageInput").files[0];

  if (!currentUser) return alert("กรุณาเข้าสู่ระบบ");
  if (postInput === "" && !imageInput)
    return alert("กรุณาพิมพ์ข้อความหรือเลือกรูปภาพ");

  let imageURL = "";
  if (imageInput) {
    let reader = new FileReader();
    reader.onload = function (event) {
      imageURL = event.target.result;
      savePost(postInput, imageURL);
      clearPostInput();
    };
    reader.readAsDataURL(imageInput);
  } else {
    savePost(postInput, imageURL);
    clearPostInput();
  }
}

function clearPostInput() {
  document.getElementById("popupPostInput").value = "";
  document.getElementById("imageInput").value = "";
  document.getElementById("previewImagePopup").style.display = "none";
  document.getElementById("imagePreviewContainer").style.display = "none";
  closePopup();
}

function openPopup() {
  document.getElementById("postPopup").classList.add("show");
}

function closePopup() {
  document.getElementById("postPopup").classList.remove("show");
}

